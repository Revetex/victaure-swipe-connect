
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12"
import { corsHeaders } from '../_shared/cors.ts'

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
  const url = 'https://www.welcometothejungle.com/fr/jobs';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    $('[data-testid="job-card"]').each((_, element) => {
      const $element = $(element);
      const job: JobData = {
        title: $element.find('[data-testid="job-card-title"]').text().trim(),
        company: 'WTTJ',
        location: $element.find('[data-testid="job-card-location"]').text().trim(),
        description: $element.find('[data-testid="job-card-description"]').text().trim(),
        url: 'https://www.welcometothejungle.com' + $element.find('a').attr('href'),
        source_platform: 'welcometothejungle',
        posted_at: new Date().toISOString(),
        skills: extractSkills($element.find('[data-testid="job-card-description"]').text())
      };

      if (job.title) {
        jobs.push(job);
      }
    });
  } catch (error) {
    console.error('Erreur lors du scraping WTTJ:', error);
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting job scraping...');
    
    // Scraper les emplois
    const wttjJobs = await scrapeWelcomeToTheJungle();
    console.log(`Found ${wttjJobs.length} jobs from WTTJ`);

    // Connexion à Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sauvegarder les emplois
    for (const job of wttjJobs) {
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
        count: wttjJobs.length
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
