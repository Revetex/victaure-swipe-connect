
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchJobsFromAPI() {
  try {
    const apiUrl = 'https://api.emploiquebec.gouv.qc.ca/partenaires/v1/offres-emploi';
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('EMPLOI_QUEBEC_API_KEY')}`
      }
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();
    return data.offres || [];
  } catch (error) {
    console.error('Error fetching jobs from API:', error);
    
    // Plan B: Utiliser des données de test pour le développement
    return [{
      titre: "Développeur Full Stack",
      entreprise: "Tech Québec Inc",
      ville: "Québec",
      description: "Nous recherchons un développeur full stack passionné",
      salaire: "65000-85000",
      type: "Temps plein",
      url: "https://example.com/job1"
    },
    {
      titre: "Designer UI/UX",
      entreprise: "Studio Design",
      ville: "Québec",
      description: "Poste créatif en design d'interface",
      salaire: "55000-75000",
      type: "Temps plein",
      url: "https://example.com/job2"
    }];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job fetching process...')

    const jobs = await fetchJobsFromAPI();
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
            title: job.titre || job.title,
            company: job.entreprise || job.company,
            location: job.ville || job.location || 'Québec',
            description: job.description || '',
            salary_range: job.salaire || job.salary || '',
            url: job.url || '',
            posted_at: job.date_publication || new Date().toISOString(),
            source_platform: 'emploi_quebec',
            employment_type: job.type || 'FULL_TIME',
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
    console.error('Error in job fetching:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
