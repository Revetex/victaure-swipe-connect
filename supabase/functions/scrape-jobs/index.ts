
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  url: string;
  posted_at: Date;
  job_type?: string;
  source: string;
}

async function scrapeJobs(): Promise<JobData[]> {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Scraping Indeed
    console.log('Scraping Indeed...');
    await page.goto('https://ca.indeed.com/jobs?l=Quebec&radius=100&sort=date');
    const indeedJobs = await page.evaluate(() => {
      const jobs: JobData[] = [];
      const cards = document.querySelectorAll('.job_seen_beacon');
      
      cards.forEach((card) => {
        const titleEl = card.querySelector('.jobTitle')?.textContent;
        const companyEl = card.querySelector('.companyName')?.textContent;
        const locationEl = card.querySelector('.companyLocation')?.textContent;
        const salaryEl = card.querySelector('.salary-snippet')?.textContent;
        const urlEl = card.querySelector('a')?.getAttribute('href');
        const jobTypeEl = card.querySelector('.jobTypes')?.textContent;

        if (titleEl && companyEl && locationEl) {
          jobs.push({
            title: titleEl.trim(),
            company: companyEl.trim(),
            location: locationEl.trim(),
            salary: salaryEl?.trim(),
            url: urlEl ? `https://ca.indeed.com${urlEl}` : '',
            posted_at: new Date(),
            job_type: jobTypeEl?.trim(),
            source: 'indeed'
          });
        }
      });
      
      return jobs;
    });

    // Scraping LinkedIn
    console.log('Scraping LinkedIn...');
    await page.goto('https://www.linkedin.com/jobs/search/?location=Quebec');
    const linkedinJobs = await page.evaluate(() => {
      const jobs: JobData[] = [];
      const cards = document.querySelectorAll('.jobs-search__results-list li');
      
      cards.forEach((card) => {
        const titleEl = card.querySelector('.base-search-card__title')?.textContent;
        const companyEl = card.querySelector('.base-search-card__subtitle')?.textContent;
        const locationEl = card.querySelector('.job-search-card__location')?.textContent;
        const urlEl = card.querySelector('a')?.getAttribute('href');

        if (titleEl && companyEl && locationEl && urlEl) {
          jobs.push({
            title: titleEl.trim(),
            company: companyEl.trim(),
            location: locationEl.trim(),
            url: urlEl,
            posted_at: new Date(),
            source: 'linkedin'
          });
        }
      });
      
      return jobs;
    });

    const allJobs = [...indeedJobs, ...linkedinJobs];
    console.log(`Found ${allJobs.length} jobs`);
    return allJobs;

  } catch (error) {
    console.error('Error in scraping function:', error);
    throw error;
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping...');
    const jobs = await scrapeJobs();

    // Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(
        jobs.map(job => ({
          ...job,
          posted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'url' }
      );

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, count: jobs.length }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
