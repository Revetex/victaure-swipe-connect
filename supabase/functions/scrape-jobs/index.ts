
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs() {
  try {
    const API_KEY = 'AIzaSyACeSmrGf4l49R9E3-I3ZRU-R9YtxTVj60';
    console.log('Fetching jobs from Google Search API...');

    const queries = [
      'site:indeed.ca job OR emploi quebec',
      'site:jobillico.com job OR emploi quebec',
      'site:emploiquebec.gouv.qc.ca offre emploi',
      'site:linkedin.com/jobs quebec'
    ];

    const allJobs = [];

    for (const query of queries) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&q=${encodeURIComponent(query)}&num=10`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
          console.log(`Found ${data.items.length} results for query: ${query}`);
          
          const jobs = data.items.map(item => ({
            title: cleanTitle(item.title),
            description: item.snippet,
            url: item.link,
            company: extractCompany(item.title, item.link),
            location: extractLocation(item.title, item.snippet),
            posted_at: new Date().toISOString(),
            source_platform: determineSource(item.link),
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
  return title.replace(/\s*-\s*Indeed\.com|\s*\|\s*Jobillico|\s*\|\s*LinkedIn/gi, '').trim();
}

function extractCompany(title: string, url: string): string {
  // D'abord essayer d'extraire depuis le titre
  const parts = title.split(/[-|]/);
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  
  // Sinon extraire depuis l'URL pour LinkedIn
  if (url.includes('linkedin.com/jobs')) {
    const urlParts = url.split('/');
    const companyIndex = urlParts.indexOf('company');
    if (companyIndex !== -1 && urlParts[companyIndex + 1]) {
      return urlParts[companyIndex + 1].replace(/-/g, ' ').trim();
    }
  }
  
  return 'Non spécifié';
}

function extractLocation(title: string, description: string): string {
  const locations = ['Montréal', 'Québec', 'Laval', 'Gatineau', 'Sherbrooke', 'Trois-Rivières', 'Longueuil'];
  const content = (title + ' ' + description).toLowerCase();
  
  for (const location of locations) {
    if (content.toLowerCase().includes(location.toLowerCase())) {
      return location;
    }
  }
  
  return 'Québec'; // Default location
}

function determineSource(url: string): string {
  if (url.includes('indeed')) return 'indeed';
  if (url.includes('jobillico')) return 'jobillico';
  if (url.includes('emploiquebec')) return 'emploi_quebec';
  if (url.includes('linkedin.com/jobs')) return 'linkedin';
  return 'other';
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
          .upsert(job, {
            onConflict: 'url'
          });

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
