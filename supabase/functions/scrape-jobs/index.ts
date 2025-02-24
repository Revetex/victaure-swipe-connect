
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function scrapeIndeedJobs() {
  try {
    const response = await fetch('https://ca.indeed.com/jobs?l=Quebec&lang=fr', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    
    // Extraction simple des données avec regex
    const jobCards = html.match(/<div class="job_seen_beacon">(.*?)<\/div>/gs) || [];
    
    return jobCards.map(card => {
      const titleMatch = card.match(/<h2[^>]*>(.*?)<\/h2>/s);
      const companyMatch = card.match(/class="companyName"[^>]*>(.*?)<\/span>/s);
      const locationMatch = card.match(/class="companyLocation"[^>]*>(.*?)<\/div>/s);
      const salaryMatch = card.match(/class="salary-snippet"[^>]*>(.*?)<\/div>/s);
      const descriptionMatch = card.match(/class="job-snippet"[^>]*>(.*?)<\/ul>/s);
      
      return {
        title: titleMatch ? cleanHtml(titleMatch[1]) : '',
        company: companyMatch ? cleanHtml(companyMatch[1]) : '',
        location: locationMatch ? cleanHtml(locationMatch[1]) : '',
        salary_range: salaryMatch ? cleanHtml(salaryMatch[1]) : '',
        description: descriptionMatch ? cleanHtml(descriptionMatch[1]) : '',
        url: `https://ca.indeed.com/viewjob?jk=${card.match(/data-jk="([^"]+)"/)?.[1] || ''}`,
        posted_at: new Date().toISOString()
      };
    }).filter(job => job.title && job.company); // Ne garde que les jobs avec au moins un titre et une entreprise
  } catch (error) {
    console.error('Error scraping Indeed:', error);
    return [];
  }
}

function cleanHtml(str: string) {
  return str
    .replace(/<[^>]+>/g, '') // Enlève les tags HTML
    .replace(/&nbsp;/g, ' ') // Remplace les &nbsp; par des espaces
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul espace
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')

    const jobs = await scrapeIndeedJobs();
    console.log(`Found ${jobs.length} jobs`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let savedCount = 0;
    for (const job of jobs) {
      try {
        const { error } = await supabase
          .from('scraped_jobs')
          .upsert({
            ...job,
            source_platform: 'indeed',
            employment_type: 'FULL_TIME',
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
    console.error('Error in job scraping:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
