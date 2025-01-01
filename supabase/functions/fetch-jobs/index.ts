import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobPosting {
  title: string;
  company: string;
  location: string;
  url: string;
  platform: string;
  description: string;
  salary?: string;
  posted_at: string;
}

async function fetchLinkedInJobs(): Promise<JobPosting[]> {
  // Simulate LinkedIn jobs for now
  // In production, this would use LinkedIn's API
  return [
    {
      title: "Développeur Full Stack",
      company: "Tech Company",
      location: "Montréal, QC",
      url: "https://linkedin.com/jobs/...",
      platform: "LinkedIn",
      description: "Nous recherchons un développeur full stack...",
      posted_at: new Date().toISOString()
    }
  ];
}

async function fetchIndeedJobs(): Promise<JobPosting[]> {
  // Simulate Indeed jobs for now
  // In production, this would use Indeed's API
  return [
    {
      title: "Développeur Frontend",
      company: "Startup Inc",
      location: "Québec, QC",
      url: "https://indeed.com/jobs/...",
      platform: "Indeed",
      description: "Startup en croissance cherche...",
      posted_at: new Date().toISOString()
    }
  ];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching jobs from multiple platforms...');
    
    // Fetch jobs from multiple platforms in parallel
    const [linkedInJobs, indeedJobs] = await Promise.all([
      fetchLinkedInJobs(),
      fetchIndeedJobs()
    ]);

    const allJobs = [...linkedInJobs, ...indeedJobs];
    
    // Sort by most recent
    allJobs.sort((a, b) => 
      new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    );

    console.log(`Found ${allJobs.length} jobs from all platforms`);

    return new Response(
      JSON.stringify({ jobs: allJobs }),
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
      JSON.stringify({ error: error.message }),
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