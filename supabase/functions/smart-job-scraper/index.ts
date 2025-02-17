
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchJob {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  source: string;
  posted_at: string;
  job_type?: string;
  requirements?: string[];
  benefits?: string[];
}

async function scrapeIndeed(query: string): Promise<SearchJob[]> {
  const url = `https://ca.indeed.com/jobs?q=${encodeURIComponent(query)}&l=Quebec&sort=date`;
  const response = await fetch(url);
  const html = await response.text();

  // Extraire les emplois avec regex
  const jobs: SearchJob[] = [];
  const jobBlocks = html.match(/<div class="job_seen_beacon">(.*?)<\/div>/gs) || [];

  jobBlocks.forEach(block => {
    const title = block.match(/title="(.*?)"/)?.[1] || '';
    const company = block.match(/companyName">(.*?)<\/span>/)?.[1] || '';
    const location = block.match(/companyLocation">(.*?)<\/div>/)?.[1] || '';
    const url = 'https://ca.indeed.com' + (block.match(/href="(.*?)"/)?.[1] || '');
    
    jobs.push({
      title,
      company,
      location,
      description: '',
      url,
      source: 'indeed',
      posted_at: new Date().toISOString()
    });
  });

  return jobs;
}

async function scrapeLinkedIn(): Promise<SearchJob[]> {
  const url = 'https://www.linkedin.com/jobs/search?keywords=&location=Quebec&geoId=105927923&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0';
  const response = await fetch(url);
  const html = await response.text();
  
  const jobs: SearchJob[] = [];
  const jobCards = html.match(/<div class="base-card relative.*?<\/div>/gs) || [];

  jobCards.forEach(card => {
    const title = card.match(/job-title">(.*?)<\/h3>/)?.[1] || '';
    const company = card.match(/base-search-card__subtitle">(.*?)<\/h4>/)?.[1] || '';
    const location = card.match(/job-search-card__location">(.*?)<\/span>/)?.[1] || '';
    const url = card.match(/href="(.*?)"/)?.[1] || '';

    jobs.push({
      title,
      company,
      location,
      description: '',
      url,
      source: 'linkedin',
      posted_at: new Date().toISOString()
    });
  });

  return jobs;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les jobs de différentes sources
    const queries = [
      "développeur",
      "software engineer",
      "web developer",
      "programmeur",
      "full stack",
      "frontend",
      "backend",
      "devops"
    ];

    let allJobs: SearchJob[] = [];

    // Paralléliser les requêtes pour plus de rapidité
    await Promise.all([
      ...queries.map(q => scrapeIndeed(q)),
      scrapeLinkedIn()
    ]).then(results => {
      results.forEach(jobs => {
        allJobs = [...allJobs, ...jobs];
      });
    });

    console.log(`Found ${allJobs.length} total jobs`);

    // Dédupliquer les emplois par URL
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.url, job])).values());

    // Sauvegarder dans Supabase avec plus d'informations
    for (const job of uniqueJobs) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert(
          {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            source_platform: job.source,
            posted_at: job.posted_at,
            job_type: job.job_type || 'full-time',
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            is_remote: job.location.toLowerCase().includes('remote') || job.location.toLowerCase().includes('télétravail'),
            relevance_score: 1
          },
          { onConflict: 'url' }
        );

      if (error) {
        console.error('Error saving job:', error);
      }
    }

    // Nettoyer les vieux jobs
    const { error: cleanupError } = await supabase
      .from('scraped_jobs')
      .delete()
      .lt('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (cleanupError) {
      console.error('Error cleaning up old jobs:', cleanupError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and saved ${uniqueJobs.length} unique jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in smart-job-scraper:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
