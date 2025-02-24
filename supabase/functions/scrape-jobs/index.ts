
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function searchJobs() {
  try {
    const SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');
    const API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    
    console.log('Fetching jobs from Google Custom Search...');

    const queries = [
      'site:indeed.ca emploi quebec',
      'site:jobillico.com emploi quebec',
      'site:emploiquebec.gouv.qc.ca offre emploi'
    ];

    const allJobs = [];

    for (const query of queries) {
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
          const jobs = data.items.map(item => ({
            title: item.title,
            description: item.snippet,
            url: item.link,
            company: extractCompany(item.title),
            location: 'Québec',
            posted_at: new Date().toISOString(),
            source_platform: determineSource(item.link)
          }));
          
          allJobs.push(...jobs);
        }
      } catch (error) {
        console.error(`Error fetching results for query "${query}":`, error);
      }
    }

    return allJobs;
  } catch (error) {
    console.error('Error in searchJobs:', error);
    return [];
  }
}

function extractCompany(title: string): string {
  // Essaie d'extraire le nom de l'entreprise du titre
  const parts = title.split('-').map(p => p.trim());
  return parts.length > 1 ? parts[parts.length - 1] : 'Non spécifié';
}

function determineSource(url: string): string {
  if (url.includes('indeed')) return 'indeed';
  if (url.includes('jobillico')) return 'jobillico';
  if (url.includes('emploiquebec')) return 'emploi_quebec';
  return 'other';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job search process...')

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
          .upsert({
            ...job,
            last_checked: new Date().toISOString()
          }, {
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
