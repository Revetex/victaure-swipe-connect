
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source_platform: string;
  skills?: string[];
  posted_at: string;
}

async function scrapeWelcomeToTheJungle(): Promise<JobData[]> {
  const jobs: JobData[] = [];
  const url = 'https://www.welcometothejungle.com/fr/companies/ftle/jobs';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('[data-testid="job-card"]').each((_, element) => {
      const description = $(element).find('[data-testid="job-card-description"]').text().trim();
      const job: JobData = {
        title: $(element).find('[data-testid="job-card-title"]').text().trim(),
        company: 'FTLE',
        location: $(element).find('[data-testid="job-card-location"]').text().trim(),
        description,
        url: 'https://www.welcometothejungle.com' + $(element).find('a').attr('href'),
        source_platform: 'welcometothejungle',
        skills: extractSkills(description),
        posted_at: new Date().toISOString()
      };

      if (job.title) {
        jobs.push(job);
      }
    });
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
  }

  return jobs;
}

async function scrapeLinkedIn(): Promise<JobData[]> {
  const jobs: JobData[] = [];
  const url = 'https://www.linkedin.com/jobs/search/?location=Quebec';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('.job-search-card').each((_, element) => {
      const description = $(element).find('.job-search-card__description').text().trim();
      const job: JobData = {
        title: $(element).find('.job-search-card__title').text().trim(),
        company: $(element).find('.job-search-card__company-name').text().trim(),
        location: $(element).find('.job-search-card__location').text().trim(),
        description,
        url: $(element).find('a').attr('href') || '',
        source_platform: 'linkedin',
        skills: extractSkills(description),
        posted_at: new Date().toISOString()
      };

      if (job.title && job.company) {
        jobs.push(job);
      }
    });
  } catch (error) {
    console.error('Erreur lors du scraping LinkedIn:', error);
  }

  return jobs;
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js',
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'PHP', 'Ruby', 'C++', 'C#',
    'Swift', 'Go', 'Rust', 'TypeScript'
  ];

  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping...');
    
    // Collecter les emplois de différentes sources
    const [wttjJobs, linkedInJobs] = await Promise.all([
      scrapeWelcomeToTheJungle(),
      scrapeLinkedIn()
    ]);

    const allJobs = [...wttjJobs, ...linkedInJobs];
    console.log(`Found ${allJobs.length} jobs in total`);

    // Connexion à Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sauvegarder les emplois
    for (const job of allJobs) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          url: job.url,
          source_platform: job.source_platform,
          posted_at: job.posted_at,
          skills: job.skills,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        { onConflict: 'url' });

      if (error) {
        console.error('Error inserting job:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: allJobs.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
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
