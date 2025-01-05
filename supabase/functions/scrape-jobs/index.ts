import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Scrape Indeed jobs
    const indeedJobs = await scrapeIndeedJobs();
    
    // Scrape LinkedIn jobs
    const linkedinJobs = await scrapeLinkedInJobs();

    // Combine and format jobs
    const jobs = [...indeedJobs, ...linkedinJobs].map(job => ({
      ...job,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert jobs into Supabase
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(jobs, { 
        onConflict: 'url',
        ignoreDuplicates: true 
      });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, jobsCount: jobs.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scrape-jobs function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scrapeIndeedJobs() {
  try {
    const response = await fetch('https://ca.indeed.com/jobs?q=construction&l=Quebec', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const jobs = [];
    
    // Basic parsing using regex (in production, use a proper HTML parser)
    const jobCards = html.match(/<div class="job_seen_beacon".*?<\/div>/gs) || [];
    
    for (const card of jobCards) {
      const title = card.match(/class="jobTitle".*?>(.*?)<\//) || ['', ''];
      const company = card.match(/class="companyName".*?>(.*?)<\//) || ['', ''];
      const location = card.match(/class="companyLocation".*?>(.*?)<\//) || ['', ''];
      const url = card.match(/href="(.*?)"/) || ['', ''];
      
      jobs.push({
        title: title[1].trim(),
        company: company[1].trim(),
        location: location[1].trim(),
        url: `https://ca.indeed.com${url[1]}`,
        source: 'indeed'
      });
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

    const html = await response.text();
    const jobs = [];
    
    // Basic parsing using regex (in production, use a proper HTML parser)
    const jobCards = html.match(/<div class="base-card.*?<\/div>/gs) || [];
    
    for (const card of jobCards) {
      const title = card.match(/class="base-search-card__title".*?>(.*?)<\//) || ['', ''];
      const company = card.match(/class="base-search-card__subtitle".*?>(.*?)<\//) || ['', ''];
      const location = card.match(/class="job-search-card__location".*?>(.*?)<\//) || ['', ''];
      const url = card.match(/href="(.*?)"/) || ['', ''];
      
      jobs.push({
        title: title[1].trim(),
        company: company[1].trim(),
        location: location[1].trim(),
        url: url[1],
        source: 'linkedin'
      });
    }
    
    return jobs;
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return [];
  }
}