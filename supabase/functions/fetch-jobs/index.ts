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
  salary_range?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractSalaryRange(text: string): string | undefined {
  // Common salary patterns
  const patterns = [
    /\$(\d{1,3}(,\d{3})*(\.\d{2})?)\s*-\s*\$(\d{1,3}(,\d{3})*(\.\d{2})?)/i,
    /(\d{2,3}k)\s*-\s*(\d{2,3}k)/i,
    /\$(\d{1,3}(,\d{3})*(\.\d{2})?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return undefined;
}

function parseLocation(location: string): string {
  // Clean up and standardize location
  const cleaned = location.trim()
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .trim();

  // Extract city and province/state if possible
  const parts = cleaned.split(',').map(part => part.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return cleaned;
}

function parseDatePosted(dateText: string): string {
  const now = new Date();
  const text = dateText.toLowerCase();

  if (text.includes('just posted') || text.includes('today')) {
    return now.toISOString();
  }

  if (text.includes('yesterday')) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString();
  }

  const daysAgoMatch = text.match(/(\d+)\s*days?\s*ago/);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1]);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  // Default to current date if we can't parse
  return now.toISOString();
}

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
      const locationRaw = card.querySelector('.job-card-container__metadata-item')?.textContent?.trim() || '';
      const datePosted = card.querySelector('.job-card-container__listed-time')?.textContent?.trim() || '';
      const description = card.querySelector('.job-card-list__description')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';
      
      // Extract salary if present in description or title
      const salaryRange = extractSalaryRange(description + ' ' + title);
      
      // Only add jobs that have all required information and are in Canada
      const location = parseLocation(locationRaw);
      if (location.toLowerCase().includes('canada')) {
        jobs.push({
          title,
          company,
          location,
          url: `https://www.linkedin.com${url}`,
          platform: 'LinkedIn',
          description,
          posted_at: parseDatePosted(datePosted),
          salary_range: salaryRange
        });
      }
    });

    console.log(`Found ${jobs.length} LinkedIn jobs in Canada`);
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
      const locationRaw = card.querySelector('.companyLocation')?.textContent?.trim() || '';
      const datePosted = card.querySelector('.date')?.textContent?.trim() || '';
      const description = card.querySelector('.job-snippet')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';
      const salaryElem = card.querySelector('.salary-snippet') || card.querySelector('.estimated-salary');
      const salaryRange = salaryElem ? extractSalaryRange(salaryElem.textContent || '') : undefined;

      // Only add jobs that have all required information and are in Canada
      const location = parseLocation(locationRaw);
      if (location.toLowerCase().includes('canada')) {
        jobs.push({
          title,
          company,
          location,
          url: `https://ca.indeed.com${url}`,
          platform: 'Indeed',
          description,
          posted_at: parseDatePosted(datePosted),
          salary_range: salaryRange
        });
      }
    });

    console.log(`Found ${jobs.length} Indeed jobs in Canada`);
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
    
    // Filter out jobs with very high salaries (over $200k) or suspicious looking salaries
    const filteredJobs = allJobs.filter(job => {
      if (job.salary_range) {
        const salary = job.salary_range.replace(/[^0-9]/g, '');
        const maxSalary = parseInt(salary);
        return !maxSalary || maxSalary < 200000; // Filter out if salary > 200k
      }
      return true;
    });

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