
import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function scrapeJobs() {
  const jobs = [];
  
  // Sites d'emploi québécois à scraper
  const sites = [
    {
      url: 'https://www.jobillico.com/recherche-emploi?skwd=&wloc=Quebec',
      scraper: async () => {
        try {
          const response = await fetch('https://www.jobillico.com/api/public/jobs/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "query": "",
              "location": "Quebec",
              "page": 1,
              "limit": 50
            })
          });
          
          const data = await response.json();
          return data.jobs?.map(job => ({
            title: job.title,
            company: job.company.name,
            location: job.location.city,
            description: job.description,
            url: `https://www.jobillico.com/fr/offre-emploi/${job.id}`,
            posted_at: job.publishedDate
          })) || [];
        } catch (error) {
          console.error('Error scraping Jobillico:', error);
          return [];
        }
      }
    },
    {
      url: 'https://emploiquebec.gouv.qc.ca/regions',
      scraper: async () => {
        try {
          const response = await fetch('https://placement.emploiquebec.gouv.qc.ca/mbe/ut/rechroffr/listoffr.asp?mtcle=&date=3&creg=QC');
          const html = await response.text();
          const $ = cheerio.load(html);
          
          return $('.offre').map((i, el) => ({
            title: $(el).find('h2').text().trim(),
            company: $(el).find('.entreprise').text().trim(),
            location: $(el).find('.lieu').text().trim(),
            description: $(el).find('.description').text().trim(),
            url: 'https://placement.emploiquebec.gouv.qc.ca' + $(el).find('a').attr('href'),
            posted_at: new Date().toISOString()
          })).get();
        } catch (error) {
          console.error('Error scraping Emploi Quebec:', error);
          return [];
        }
      }
    },
    {
      url: 'https://www.workopolis.com/fr/emplois/quebec',
      scraper: async () => {
        try {
          const response = await fetch('https://www.workopolis.com/api/v1.0/search/jobs?location=quebec');
          const data = await response.json();
          
          return data.jobs?.map(job => ({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            posted_at: job.datePosted
          })) || [];
        } catch (error) {
          console.error('Error scraping Workopolis:', error);
          return [];
        }
      }
    }
  ];

  // Scraper chaque site en parallèle
  const results = await Promise.allSettled(
    sites.map(site => site.scraper())
  );

  // Combiner tous les résultats
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Successfully scraped ${sites[index].url}: ${result.value.length} jobs found`);
      jobs.push(...result.value);
    } else {
      console.error(`Failed to scrape ${sites[index].url}:`, result.reason);
    }
  });

  return jobs;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')

    const jobs = await scrapeJobs();
    console.log(`Found ${jobs.length} jobs total`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let savedCount = 0;
    for (const job of jobs) {
      if (!job.title || !job.company) continue;

      try {
        const { error } = await supabase
          .from('scraped_jobs')
          .upsert({
            title: job.title,
            company: job.company,
            location: job.location || 'Québec',
            description: job.description || '',
            url: job.url,
            posted_at: job.posted_at || new Date().toISOString(),
            source_platform: 'quebec_jobs',
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
