
import { createClient } from "@supabase/supabase-js";
import * as puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  salary_range?: string;
  url: string;
  posted_date: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping process...');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('Browser launched, starting scraping...');

    // Configuration pour Indeed
    await page.goto('https://ca.indeed.com/jobs?l=Quebec&sc=0kf%3Ajt%28fulltime%29%3B');
    await page.waitForSelector('.job_seen_beacon');

    const jobs: Job[] = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job_seen_beacon');
      return Array.from(jobCards).map((card) => {
        const titleElement = card.querySelector('.jobTitle');
        const companyElement = card.querySelector('.companyName');
        const locationElement = card.querySelector('.companyLocation');
        const snippetElement = card.querySelector('.job-snippet');
        const salaryElement = card.querySelector('.salary-snippet');
        const dateElement = card.querySelector('.date');

        return {
          title: titleElement?.textContent?.trim() || '',
          company: companyElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || '',
          description: snippetElement?.textContent?.trim() || '',
          salary_range: salaryElement?.textContent?.trim() || undefined,
          url: (card.querySelector('a[data-jk]') as HTMLAnchorElement)?.href || '',
          posted_date: dateElement?.textContent?.trim() || new Date().toISOString()
        };
      });
    });

    await browser.close();

    console.log(`Found ${jobs.length} jobs, saving to database...`);

    // Sauvegarder dans Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    for (const job of jobs) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          salary_range: job.salary_range,
          url: job.url,
          posted_date: job.posted_date,
          source: 'indeed',
          last_checked: new Date().toISOString()
        }, {
          onConflict: 'url'
        });

      if (error) {
        console.error('Error saving job:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      jobs: jobs.length
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
