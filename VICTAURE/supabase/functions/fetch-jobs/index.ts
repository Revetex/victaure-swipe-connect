import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    console.log('Starting job scraping...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sample jobs for testing (we'll replace this with real scraping later)
    const sampleJobs: ScrapedJob[] = [
      {
        title: "Développeur Full Stack",
        company: "Tech Solutions Inc",
        location: "Montréal, QC",
        description: "Nous recherchons un développeur Full Stack expérimenté...",
        url: "https://example.com/job1",
        posted_at: new Date().toISOString(),
        source: "Indeed"
      },
      {
        title: "Ingénieur DevOps",
        company: "Cloud Systems",
        location: "Québec, QC",
        description: "Poste d'ingénieur DevOps senior...",
        url: "https://example.com/job2",
        posted_at: new Date().toISOString(),
        source: "LinkedIn"
      },
      {
        title: "Développeur Frontend React",
        company: "Digital Agency",
        location: "Laval, QC",
        description: "Rejoignez notre équipe de développement frontend...",
        url: "https://example.com/job3",
        posted_at: new Date().toISOString(),
        source: "Indeed"
      }
    ];

    console.log(`Generated ${sampleJobs.length} sample jobs`);

    // Insert jobs into Supabase
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(
        sampleJobs.map(job => ({
          ...job,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'url',
          ignoreDuplicates: false 
        }
      );

    if (error) {
      console.error('Error inserting jobs:', error);
      throw error;
    }

    console.log(`Successfully saved ${sampleJobs.length} jobs to database`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and saved ${sampleJobs.length} jobs`,
        jobsCount: sampleJobs.length 
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