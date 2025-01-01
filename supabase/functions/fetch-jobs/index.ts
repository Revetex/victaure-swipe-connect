import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchLinkedInJobs } from "./scrapers/linkedinScraper.ts";
import { fetchIndeedJobs } from "./scrapers/indeedScraper.ts";
import { isSalaryWithinLimit } from "./utils/salaryParser.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching jobs from multiple platforms...');
    
    const [linkedInJobs, indeedJobs] = await Promise.all([
      fetchLinkedInJobs(),
      fetchIndeedJobs()
    ]);

    const allJobs = [...linkedInJobs, ...indeedJobs];
    
    // Filter out jobs with very high salaries
    const filteredJobs = allJobs.filter(job => isSalaryWithinLimit(job.salary_range));

    // Sort by most recent
    filteredJobs.sort((a, b) => 
      new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    );

    console.log(`Found ${filteredJobs.length} valid jobs from all platforms`);

    return new Response(
      JSON.stringify({ 
        jobs: filteredJobs,
        metadata: {
          total: filteredJobs.length,
          sources: {
            linkedin: linkedInJobs.length,
            indeed: indeedJobs.length
          },
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
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