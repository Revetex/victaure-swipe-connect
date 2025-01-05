import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  salary_range?: string;
  posted_at: Date;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Scrape Indeed
    const indeedJobs = await scrapeIndeed();
    console.log('Scraped Indeed jobs:', indeedJobs);

    // Store jobs in Supabase
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(
        indeedJobs.map(job => ({
          ...job,
          created_at: new Date(),
          updated_at: new Date()
        })),
        { onConflict: 'url' }
      );

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: 'Jobs scraped and stored successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in job-scraper function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function scrapeIndeed(): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];
  const baseUrl = 'https://ca.indeed.com/jobs?q=developer&l=Montreal%2C+QC';

  try {
    const response = await fetch(baseUrl, {
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

    const jobCards = doc.querySelectorAll('.job_seen_beacon');
    
    jobCards.forEach((card) => {
      const title = card.querySelector('.jobTitle')?.textContent?.trim() || '';
      const company = card.querySelector('.companyName')?.textContent?.trim() || '';
      const location = card.querySelector('.companyLocation')?.textContent?.trim() || '';
      const salary = card.querySelector('.salary-snippet')?.textContent?.trim();
      const description = card.querySelector('.job-snippet')?.textContent?.trim();
      const url = card.querySelector('a')?.getAttribute('href');

      if (title && company) {
        jobs.push({
          title,
          company,
          location,
          description,
          url: url ? `https://ca.indeed.com${url}` : undefined,
          salary_range: salary,
          posted_at: new Date()
        });
      }
    });

    console.log(`Scraped ${jobs.length} jobs from Indeed`);
    return jobs;
  } catch (error) {
    console.error('Error scraping Indeed:', error);
    return [];
  }
}