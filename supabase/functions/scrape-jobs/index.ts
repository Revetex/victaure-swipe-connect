import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting job scraping...");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Scrape Indeed jobs
    const indeedJobs = await scrapeIndeedJobs();
    console.log(`Scraped ${indeedJobs.length} jobs from Indeed`);
    
    // Scrape LinkedIn jobs
    const linkedinJobs = await scrapeLinkedInJobs();
    console.log(`Scraped ${linkedinJobs.length} jobs from LinkedIn`);

    // Combine and format jobs
    const jobs = [...indeedJobs, ...linkedinJobs].map(job => ({
      ...job,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log(`Total jobs to insert: ${jobs.length}`);

    // Insert jobs into Supabase, using url as the conflict key
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(
        jobs,
        { 
          onConflict: 'url',
          ignoreDuplicates: false // Set to false to update existing records
        }
      );

    if (error) {
      console.error("Error inserting jobs:", error);
      throw error;
    }

    console.log("Successfully inserted jobs into database");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and saved ${jobs.length} jobs`,
        jobsCount: jobs.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in scrape-jobs function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
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

async function scrapeIndeedJobs() {
  try {
    const response = await fetch('https://ca.indeed.com/jobs?q=construction&l=Quebec', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    const jobs = [];
    const jobCards = doc.querySelectorAll('.job_seen_beacon');
    
    for (const card of jobCards) {
      const title = card.querySelector('.jobTitle')?.textContent?.trim();
      const company = card.querySelector('.companyName')?.textContent?.trim();
      const location = card.querySelector('.companyLocation')?.textContent?.trim();
      const url = card.querySelector('a')?.getAttribute('href');
      const description = card.querySelector('.job-snippet')?.textContent?.trim();
      
      if (title && company && location && url) {
        jobs.push({
          title,
          company,
          location,
          description,
          url: `https://ca.indeed.com${url}`,
          source: 'indeed',
          posted_at: new Date().toISOString()
        });
      }
    }
    
    return jobs;
  } catch (error) {
    console.error('Error scraping Indeed:', error);
    return [];
  }
}

async function scrapeLinkedInJobs() {
  try {
    const response = await fetch('https://www.linkedin.com/jobs/search?keywords=construction&location=Quebec', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    const jobs = [];
    const jobCards = doc.querySelectorAll('.job-search-card');
    
    for (const card of jobCards) {
      const title = card.querySelector('.job-search-card__title')?.textContent?.trim();
      const company = card.querySelector('.job-search-card__company-name')?.textContent?.trim();
      const location = card.querySelector('.job-search-card__location')?.textContent?.trim();
      const url = card.querySelector('a')?.getAttribute('href');
      const description = card.querySelector('.job-search-card__snippet')?.textContent?.trim();
      
      if (title && company && location && url) {
        jobs.push({
          title,
          company,
          location,
          description,
          url,
          source: 'linkedin',
          posted_at: new Date().toISOString()
        });
      }
    }
    
    return jobs;
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return [];
  }
}