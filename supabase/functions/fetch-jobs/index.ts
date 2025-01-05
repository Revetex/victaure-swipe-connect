import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { IndeedScraper } from "./scrapers/indeedScraper.ts";
import { LinkedInScraper } from "./scrapers/linkedinScraper.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize scrapers
    const indeedScraper = new IndeedScraper();
    const linkedinScraper = new LinkedInScraper();

    // Scrape jobs from different sources
    const indeedJobs = await indeedScraper.scrape('https://ca.indeed.com/jobs?q=construction&l=Quebec');
    const linkedinJobs = await linkedinScraper.scrape('https://www.linkedin.com/jobs/search?keywords=construction&location=Quebec');

    console.log(`Found ${indeedJobs.length} Indeed jobs and ${linkedinJobs.length} LinkedIn jobs`);

    // Combine all jobs
    const allJobs = [...indeedJobs, ...linkedinJobs].map(job => ({
      ...job,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert jobs into Supabase
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(
        allJobs,
        { 
          onConflict: 'url',
          ignoreDuplicates: true 
        }
      );

    if (error) throw error;

    console.log(`Successfully saved ${allJobs.length} jobs to database`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and saved ${allJobs.length} jobs`,
        jobsCount: allJobs.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-jobs function:', error);
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