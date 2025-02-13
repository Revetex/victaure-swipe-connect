
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Sources d'emplois à scraper
    const sources = [
      { url: 'https://www.indeed.com/jobs?q=&l=Canada', platform: 'indeed' },
      { url: 'https://www.linkedin.com/jobs/search/?location=Canada', platform: 'linkedin' }
    ];

    const jobs: any[] = [];

    for (const source of sources) {
      try {
        console.log(`Scraping jobs from ${source.platform}...`);
        const fetchedJobs = await scrapeJobSource(source);
        jobs.push(...fetchedJobs.map(job => ({
          ...job,
          source_platform: source.platform
        })));
      } catch (error) {
        console.error(`Error scraping ${source.platform}:`, error);
      }
    }

    // Traiter et enrichir les données
    const enrichedJobs = await Promise.all(jobs.map(async (job) => {
      return {
        ...job,
        skills: extractSkills(job.description || ''),
        match_score: calculateJobScore(job),
        requirements: extractRequirements(job.description || ''),
        benefits: extractBenefits(job.description || ''),
        industry: detectIndustry(job.title, job.description),
        remote_type: detectRemoteType(job.description),
        relevance_score: calculateRelevanceScore(job)
      };
    }));

    // Insérer ou mettre à jour les emplois dans la base de données
    const { error } = await supabaseClient
      .from('scraped_jobs')
      .upsert(
        enrichedJobs,
        { 
          onConflict: 'url',
          ignoreDuplicates: false 
        }
      );

    if (error) throw error;

    // Nettoyer les anciens emplois (plus de 30 jours)
    await supabaseClient
      .from('scraped_jobs')
      .delete()
      .lt('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return new Response(
      JSON.stringify({
        success: true,
        jobsProcessed: enrichedJobs.length,
        message: "Jobs successfully scraped and processed"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in job scraper:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function scrapeJobSource(source: { url: string; platform: string }) {
  const response = await fetch(source.url, {
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

  switch (source.platform) {
    case 'indeed':
      return scrapeIndeedJobs(doc);
    case 'linkedin':
      return scrapeLinkedInJobs(doc);
    default:
      return [];
  }
}

function scrapeIndeedJobs(doc: any) {
  const jobs = [];
  const jobCards = doc.querySelectorAll('.job_seen_beacon');

  for (const card of jobCards) {
    try {
      const job = {
        title: card.querySelector('.jobTitle')?.textContent?.trim(),
        company: card.querySelector('.companyName')?.textContent?.trim(),
        location: card.querySelector('.companyLocation')?.textContent?.trim(),
        salary_range: card.querySelector('.salary-snippet')?.textContent?.trim(),
        description: card.querySelector('.job-snippet')?.textContent?.trim(),
        url: card.querySelector('a')?.getAttribute('href'),
        posted_at: new Date().toISOString(),
        job_type: extractJobType(card.textContent),
        experience_level: extractExperienceLevel(card.textContent)
      };

      if (job.title && job.company) {
        jobs.push(job);
      }
    } catch (error) {
      console.error('Error parsing job card:', error);
    }
  }

  return jobs;
}

function scrapeLinkedInJobs(doc: any) {
  const jobs = [];
  const jobCards = doc.querySelectorAll('.job-card-container');

  for (const card of jobCards) {
    try {
      const job = {
        title: card.querySelector('.job-card-list__title')?.textContent?.trim(),
        company: card.querySelector('.job-card-container__company-name')?.textContent?.trim(),
        location: card.querySelector('.job-card-container__metadata-item')?.textContent?.trim(),
        description: card.querySelector('.job-card-list__description')?.textContent?.trim(),
        url: card.querySelector('a')?.getAttribute('href'),
        posted_at: new Date().toISOString()
      };

      if (job.title && job.company) {
        jobs.push(job);
      }
    } catch (error) {
      console.error('Error parsing LinkedIn job card:', error);
    }
  }

  return jobs;
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue',
    'Node.js', 'SQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Management', 'Leadership', 'Communication', 'Project Management',
    'Agile', 'Scrum', 'Sales', 'Marketing', 'Customer Service',
    'Data Analysis', 'Machine Learning', 'AI'
  ];

  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractRequirements(description: string): string[] {
  const requirements = [];
  const lines = description.split('\n');

  for (const line of lines) {
    if (
      line.toLowerCase().includes('required') ||
      line.toLowerCase().includes('requirement') ||
      line.toLowerCase().includes('qualification') ||
      line.toLowerCase().includes('must have')
    ) {
      requirements.push(line.trim());
    }
  }

  return requirements;
}

function extractBenefits(description: string): string[] {
  const benefits = [];
  const lines = description.split('\n');

  for (const line of lines) {
    if (
      line.toLowerCase().includes('benefit') ||
      line.toLowerCase().includes('perks') ||
      line.toLowerCase().includes('offer') ||
      line.toLowerCase().includes('insurance') ||
      line.toLowerCase().includes('vacation')
    ) {
      benefits.push(line.trim());
    }
  }

  return benefits;
}

function calculateJobScore(job: any): number {
  let score = 0;

  // Score based on completeness
  if (job.title) score += 10;
  if (job.description) score += 10;
  if (job.salary_range) score += 15;
  if (job.location) score += 10;
  if (job.company) score += 10;
  if (job.requirements?.length > 0) score += 15;
  if (job.benefits?.length > 0) score += 15;
  if (job.skills?.length > 0) score += 15;

  return Math.min(100, score);
}

function calculateRelevanceScore(job: any): number {
  const currentDate = new Date();
  const postedDate = new Date(job.posted_at);
  const daysSincePosted = (currentDate.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);

  // Plus récent = plus pertinent
  let score = 100 - Math.min(daysSincePosted * 2, 50);

  // Bonus pour les offres complètes
  if (job.salary_range) score += 10;
  if (job.skills?.length > 3) score += 10;
  if (job.benefits?.length > 0) score += 10;

  return Math.min(100, Math.max(0, score));
}

function detectIndustry(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase();
  
  const industries = {
    'Technology': ['software', 'developer', 'it ', 'tech', 'development'],
    'Healthcare': ['health', 'medical', 'clinical', 'nurse'],
    'Finance': ['finance', 'banking', 'investment', 'accountant'],
    'Education': ['teacher', 'education', 'school', 'professor'],
    'Marketing': ['marketing', 'seo', 'content', 'social media'],
    'Sales': ['sales', 'account executive', 'business development'],
    'Manufacturing': ['manufacturing', 'production', 'assembly'],
    'Construction': ['construction', 'builder', 'architect'],
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry;
    }
  }

  return 'Other';
}

function detectRemoteType(description: string): string {
  const text = description.toLowerCase();
  
  if (text.includes('remote') || text.includes('work from home') || text.includes('télétravail')) {
    if (text.includes('hybrid') || text.includes('hybride')) {
      return 'hybrid';
    }
    return 'remote';
  }
  
  return 'on-site';
}

function extractJobType(text: string): string {
  const types = {
    'full-time': ['full time', 'full-time', 'permanent', 'temps plein'],
    'part-time': ['part time', 'part-time', 'temps partiel'],
    'contract': ['contract', 'contractuel'],
    'temporary': ['temporary', 'temp', 'temporaire'],
    'internship': ['internship', 'intern', 'stage', 'stagiaire']
  };

  const loweredText = text.toLowerCase();
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => loweredText.includes(keyword))) {
      return type;
    }
  }

  return 'full-time';
}

function extractExperienceLevel(text: string): string {
  const levels = {
    'entry': ['entry level', 'junior', 'débutant', 'entry-level', '0-2 years'],
    'mid-level': ['mid level', 'intermediate', 'intermédiaire', '2-5 years', '3-5 years'],
    'senior': ['senior', 'experienced', 'expérimenté', '5+ years', '5-10 years'],
    'expert': ['expert', 'lead', 'principal', '10+ years', 'architect']
  };

  const loweredText = text.toLowerCase();
  
  for (const [level, keywords] of Object.entries(levels)) {
    if (keywords.some(keyword => loweredText.includes(keyword))) {
      return level;
    }
  }

  return 'mid-level';
}
