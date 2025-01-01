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
  try {
    const response = await fetch('https://api.linkedin.com/v2/jobs', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LINKEDIN_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('LinkedIn API error:', await response.text());
      return [];
    }

    const data = await response.json();
    return data.elements.map((job: any) => ({
      title: job.title.text,
      company: job.companyName,
      location: job.locationName,
      url: job.applyUrl,
      platform: 'LinkedIn',
      description: job.description.text,
      posted_at: job.postedAt,
    }));
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    return [];
  }
}

async function fetchIndeedJobs(): Promise<JobPosting[]> {
  try {
    const response = await fetch('https://api.indeed.com/ads/apisearch', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('INDEED_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Indeed API error:', await response.text());
      return [];
    }

    const data = await response.json();
    return data.results.map((job: any) => ({
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      url: job.url,
      platform: 'Indeed',
      description: job.snippet,
      posted_at: job.date,
    }));
  } catch (error) {
    console.error('Error fetching Indeed jobs:', error);
    return [];
  }
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