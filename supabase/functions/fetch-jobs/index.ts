import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

interface JobPosting {
  title: string;
  company: string;
  location: string;
  url: string;
  platform: string;
  description: string;
  posted_at: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchLinkedInJobs(): Promise<JobPosting[]> {
  try {
    console.log('Fetching LinkedIn jobs...');
    const response = await fetch('https://www.linkedin.com/jobs/search?keywords=developer&location=Canada', {
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

    const jobs: JobPosting[] = [];
    const jobCards = doc.querySelectorAll('.job-card-container');

    jobCards.forEach((card) => {
      const title = card.querySelector('.job-card-list__title')?.textContent?.trim() || '';
      const company = card.querySelector('.job-card-container__company-name')?.textContent?.trim() || '';
      const location = card.querySelector('.job-card-container__metadata-item')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';

      jobs.push({
        title,
        company,
        location,
        url: `https://www.linkedin.com${url}`,
        platform: 'LinkedIn',
        description: '',
        posted_at: new Date().toISOString(),
      });
    });

    console.log(`Found ${jobs.length} LinkedIn jobs`);
    return jobs;
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    return [];
  }
}

async function fetchIndeedJobs(): Promise<JobPosting[]> {
  try {
    console.log('Fetching Indeed jobs...');
    const response = await fetch('https://ca.indeed.com/jobs?q=developer&l=Canada', {
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

    const jobs: JobPosting[] = [];
    const jobCards = doc.querySelectorAll('.job_seen_beacon');

    jobCards.forEach((card) => {
      const title = card.querySelector('.jobTitle')?.textContent?.trim() || '';
      const company = card.querySelector('.companyName')?.textContent?.trim() || '';
      const location = card.querySelector('.companyLocation')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';

      jobs.push({
        title,
        company,
        location,
        url: `https://ca.indeed.com${url}`,
        platform: 'Indeed',
        description: '',
        posted_at: new Date().toISOString(),
      });
    });

    console.log(`Found ${jobs.length} Indeed jobs`);
    return jobs;
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