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
  url: string;
  posted_at: string;
  source: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping process...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fonction pour scraper Indeed
    async function scrapeIndeed(): Promise<ScrapedJob[]> {
      const jobs: ScrapedJob[] = [];
      const baseUrl = 'https://ca.indeed.com';
      const searchUrl = `${baseUrl}/jobs?l=Trois-Rivieres%2C+QC&radius=50`;

      try {
        const response = await fetch(searchUrl, {
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
        
        for (const card of jobCards) {
          const title = card.querySelector('.jobTitle')?.textContent?.trim() || '';
          const company = card.querySelector('.companyName')?.textContent?.trim() || '';
          const location = card.querySelector('.companyLocation')?.textContent?.trim() || '';
          const url = card.querySelector('a')?.getAttribute('href') || '';
          
          if (title && company) {
            jobs.push({
              title,
              company,
              location,
              url: `${baseUrl}${url}`,
              posted_at: new Date().toISOString(),
              source: 'Indeed'
            });
          }
        }
      } catch (error) {
        console.error('Error scraping Indeed:', error);
      }

      return jobs;
    }

    // Fonction pour scraper LinkedIn
    async function scrapeLinkedIn(): Promise<ScrapedJob[]> {
      const jobs: ScrapedJob[] = [];
      const searchUrl = 'https://www.linkedin.com/jobs/search?keywords=&location=Trois-Rivieres%2C%20Quebec%2C%20Canada&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0';

      try {
        const response = await fetch(searchUrl, {
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

        const jobCards = doc.querySelectorAll('.job-card-container');
        
        for (const card of jobCards) {
          const title = card.querySelector('.job-card-list__title')?.textContent?.trim() || '';
          const company = card.querySelector('.job-card-container__company-name')?.textContent?.trim() || '';
          const location = card.querySelector('.job-card-container__metadata-item')?.textContent?.trim() || '';
          const url = card.querySelector('a')?.getAttribute('href') || '';
          
          if (title && company) {
            jobs.push({
              title,
              company,
              location,
              url,
              posted_at: new Date().toISOString(),
              source: 'LinkedIn'
            });
          }
        }
      } catch (error) {
        console.error('Error scraping LinkedIn:', error);
      }

      return jobs;
    }

    // Exécuter le scraping
    console.log('Starting scraping process...');
    const [indeedJobs, linkedInJobs] = await Promise.all([
      scrapeIndeed(),
      scrapeLinkedIn()
    ]);

    const allJobs = [...indeedJobs, ...linkedInJobs];
    console.log(`Found ${allJobs.length} jobs in total`);

    // Sauvegarder les jobs dans la base de données
    if (allJobs.length > 0) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert(
          allJobs.map(job => ({
            ...job,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'url' }
        );

      if (error) {
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and saved ${allJobs.length} jobs`,
        jobCount: allJobs.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});