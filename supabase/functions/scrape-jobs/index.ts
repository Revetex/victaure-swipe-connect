
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
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
  posted_at: Date;
  source: string;
  skills?: string[];
}

async function scrapeJobs(): Promise<JobData[]> {
  const jobs: JobData[] = [];
  
  // Sites à scraper
  const targets = [
    {
      url: 'https://www.jobillico.com/recherche-emploi?skwd=&scty=Quebec',
      source: 'jobillico'
    },
    {
      url: 'https://www.linkedin.com/jobs/search/?location=Quebec',
      source: 'linkedin'
    }
  ];

  for (const target of targets) {
    try {
      console.log(`Scraping ${target.url}...`);
      
      const response = await fetch(target.url, {
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
      const $ = load(html);

      if (target.source === 'jobillico') {
        $('.job-result').each((_, element) => {
          const title = $(element).find('.job-title').text().trim();
          const company = $(element).find('.company-name').text().trim();
          const location = $(element).find('.company-location').text().trim();
          const description = $(element).find('.job-description').text().trim();
          const url = 'https://www.jobillico.com' + $(element).find('a').attr('href');

          if (title && company) {
            jobs.push({
              title,
              company,
              location,
              description,
              url,
              posted_at: new Date(),
              source: 'jobillico',
              skills: extractSkills(description)
            });
          }
        });
      } else if (target.source === 'linkedin') {
        $('.job-search-card').each((_, element) => {
          const title = $(element).find('.job-search-card__title').text().trim();
          const company = $(element).find('.job-search-card__company-name').text().trim();
          const location = $(element).find('.job-search-card__location').text().trim();
          const description = $(element).find('.job-search-card__description').text().trim();
          const url = $(element).find('a').attr('href') || '';

          if (title && company) {
            jobs.push({
              title,
              company,
              location,
              description,
              url,
              posted_at: new Date(),
              source: 'linkedin',
              skills: extractSkills(description)
            });
          }
        });
      }

      // Délai entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error scraping ${target.url}:`, error);
    }
  }

  return jobs;
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js',
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'PHP', 'Ruby', 'C++', 'C#',
    'Swift', 'Go', 'Rust', 'TypeScript'
  ];

  const skills = new Set<string>();
  
  for (const skill of commonSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  }

  return Array.from(skills);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping...');
    const jobs = await scrapeJobs();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Found ${jobs.length} jobs, storing in database...`);

    for (const job of jobs) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          url: job.url,
          source_platform: job.source,
          posted_at: new Date().toISOString(),
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
      JSON.stringify({ success: true, count: jobs.length }),
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
