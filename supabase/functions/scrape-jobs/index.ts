
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs() {
  try {
    const SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');
    const API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');

    if (!API_KEY || !SEARCH_ENGINE_ID) {
      throw new Error('Google Search API key or Search Engine ID not configured');
    }

    console.log('Fetching jobs from Google Search API...');

    const queries = [
      'site:indeed.ca filetype:html intitle:"emploi" OR intitle:"job" location:"Quebec"',
      'site:jobillico.com filetype:html intitle:"emploi" location:"Quebec"',
      'site:linkedin.com/jobs filetype:html intitle:"emploi" OR intitle:"job" location:"Quebec"',
      'site:emploiquebec.gouv.qc.ca filetype:html intitle:"offre" OR intitle:"emploi"'
    ];

    const allJobs = [];

    for (const query of queries) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
          console.error('Google Search API error:', data.error);
          continue;
        }

        if (data.items) {
          console.log(`Found ${data.items.length} results for query: ${query}`);
          
          const jobs = data.items.map(item => ({
            title: cleanTitle(item.title),
            description: item.snippet,
            url: item.link,
            location: extractLocation(item.title, item.snippet),
            company: extractCompany(item.title, item.link),
            posted_at: new Date().toISOString(),
            source_platform: determineSource(item.link),
            employment_type: extractEmploymentType(item.snippet),
            salary_range: extractSalary(item.snippet),
            last_checked: new Date().toISOString()
          }));
          
          allJobs.push(...jobs);
        }
      } catch (error) {
        console.error(`Error fetching results for query "${query}":`, error);
      }
    }

    console.log(`Total jobs found: ${allJobs.length}`);
    return allJobs;
  } catch (error) {
    console.error('Error in searchJobs:', error);
    return [];
  }
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*-\s*Indeed\.com|\s*\|\s*Jobillico|\s*\|\s*LinkedIn/gi, '')
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
}

function extractCompany(title: string, url: string): string {
  // Patterns pour trouver le nom de l'entreprise
  const patterns = [
    /(?:at|@|chez)\s+([^|.-]+)/i,
    /(.+?)\s+(?:is hiring|embauche|recherche)/i,
    /([^|.-]+?)\s+(?:-|│)/i
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Extraction depuis l'URL pour LinkedIn
  if (url.includes('linkedin.com/jobs')) {
    const companyMatch = url.match(/company\/([^/]+)/);
    if (companyMatch) {
      return companyMatch[1].replace(/-/g, ' ').trim();
    }
  }
  
  return 'Non spécifié';
}

function extractLocation(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  const locations = [
    'Montréal', 'Québec', 'Laval', 'Gatineau', 'Sherbrooke', 
    'Trois-Rivières', 'Longueuil', 'Lévis', 'Terrebonne'
  ];
  
  for (const location of locations) {
    if (content.toLowerCase().includes(location.toLowerCase())) {
      return location;
    }
  }
  
  // Chercher un code postal québécois
  const postalCodeMatch = content.match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\s*\d[ABCEGHJKLMNPRSTVWXYZ]\d/i);
  if (postalCodeMatch) {
    return 'Québec';
  }
  
  return 'Québec';
}

function determineSource(url: string): string {
  if (url.includes('indeed')) return 'indeed';
  if (url.includes('jobillico')) return 'jobillico';
  if (url.includes('emploiquebec')) return 'emploi_quebec';
  if (url.includes('linkedin.com/jobs')) return 'linkedin';
  return 'other';
}

function extractEmploymentType(description: string): string {
  const types = {
    'temps plein': 'FULL_TIME',
    'temps partiel': 'PART_TIME',
    'contractuel': 'CONTRACT',
    'permanent': 'PERMANENT',
    'temporaire': 'TEMPORARY'
  };

  const content = description.toLowerCase();
  for (const [key, value] of Object.entries(types)) {
    if (content.includes(key)) {
      return value;
    }
  }

  return 'FULL_TIME';
}

function extractSalary(description: string): string | null {
  const salaryMatch = description.match(/(\d+[\s,]?\d*(\s*[kK])?)\s*(?:\$|CAD|EUR|USD)?(?:\s*-\s*(\d+[\s,]?\d*(\s*[kK])?)\s*(?:\$|CAD|EUR|USD)?)?/);
  
  if (salaryMatch) {
    let min = salaryMatch[1].replace(/\s/g, '');
    let max = salaryMatch[3]?.replace(/\s/g, '');
    
    // Convertir k/K en milliers
    if (min.toLowerCase().endsWith('k')) {
      min = String(parseFloat(min.slice(0, -1)) * 1000);
    }
    if (max?.toLowerCase().endsWith('k')) {
      max = String(parseFloat(max.slice(0, -1)) * 1000);
    }
    
    return max ? `${min}-${max}` : min;
  }
  
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job search process...');

    const jobs = await searchJobs();
    console.log(`Found ${jobs.length} jobs total`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let savedCount = 0;
    for (const job of jobs) {
      try {
        const { error } = await supabase
          .from('scraped_jobs')
          .upsert(
            {
              ...job,
              // Générer un ID unique basé sur l'URL pour éviter les doublons
              id: await crypto.subtle.digest(
                "SHA-256",
                new TextEncoder().encode(job.url)
              ).then(hash => 
                Array.from(new Uint8Array(hash))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('')
              )
            },
            {
              onConflict: 'url'
            }
          );

        if (error) {
          console.error('Error saving job:', error);
        } else {
          savedCount++;
        }
      } catch (error) {
        console.error('Error processing job:', error);
      }
    }

    console.log(`Successfully saved ${savedCount} jobs`);

    return new Response(JSON.stringify({
      success: true,
      jobsFound: jobs.length,
      jobsSaved: savedCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error in job search:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
