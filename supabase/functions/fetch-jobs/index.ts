import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LinkedInScraper } from "./scrapers/linkedinScraper.ts";
import { IndeedScraper } from "./scrapers/indeedScraper.ts";
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
    console.log("Starting job fetch process...");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active job sources
    const { data: sources, error: sourcesError } = await supabase
      .from('job_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      throw sourcesError;
    }

    console.log("Found active sources:", sources?.length);

    const jobs = [];
    for (const source of sources) {
      try {
        console.log(`Processing source: ${source.source} - ${source.url}`);
        
        let scraper;
        switch (source.source) {
          case 'linkedin':
            scraper = new LinkedInScraper();
            break;
          case 'indeed':
            scraper = new IndeedScraper();
            break;
          default:
            console.log(`Unsupported source: ${source.source}`);
            continue;
        }

        const scrapedJobs = await scraper.scrape(source.url);
        console.log(`Scraped ${scrapedJobs.length} jobs from ${source.source}`);
        
        jobs.push(...scrapedJobs.map(job => ({
          ...job,
          source_id: source.id
        })));

      } catch (error) {
        console.error(`Error scraping source ${source.source}:`, error);
      }
    }

    console.log("Total jobs scraped:", jobs.length);

    // Update last_checked timestamp
    if (sources?.length > 0) {
      const { error: updateError } = await supabase
        .from('job_sources')
        .update({ last_checked: new Date().toISOString() })
        .in('id', sources.map(s => s.id));

      if (updateError) {
        console.error("Error updating last_checked:", updateError);
      }
    }

    // Insert scraped jobs
    if (jobs.length > 0) {
      const { error: insertError } = await supabase
        .from('scraped_jobs')
        .upsert(
          jobs,
          { onConflict: 'external_id' }
        );

      if (insertError) {
        throw insertError;
      }
      
      console.log("Successfully inserted jobs");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${jobs.length} jobs` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error("Error in fetch-jobs function:", error);
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