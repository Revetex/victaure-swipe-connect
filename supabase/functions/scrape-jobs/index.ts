
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@latest'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY')!

interface JobListing {
  title: string
  company: string
  location: string
  description: string
  url: string
  source_platform: 'linkedin' | 'glassdoor' | 'workopolis'
  salary_range?: string
  job_type?: string
  application_url?: string
  experience_level?: string
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
}

async function scrapeJobsFromWebsite(url: string): Promise<JobListing[]> {
  try {
    console.log('Initializing Firecrawl for URL:', url)
    const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY })

    const response = await firecrawl.crawlUrl(url, {
      limit: 25,
      scrapeOptions: {
        formats: ['markdown', 'html'],
        selectors: {
          // Sélecteurs CSS spécifiques pour les offres d'emploi
          jobTitle: '.job-title, .jobs-unified-top-card__job-title',
          company: '.company-name, .jobs-unified-top-card__company-name',
          location: '.location, .jobs-unified-top-card__workplace-type',
          description: '.description, .jobs-description__content',
          salary: '.salary, .jobs-unified-top-card__salary-range',
          jobType: '.job-type, .jobs-unified-top-card__job-type',
        }
      }
    })

    if (!response.success) {
      console.error('Firecrawl scraping failed:', response)
      return []
    }

    console.log('Scraping successful, processing results...')
    
    // Traitement des résultats
    const jobs: JobListing[] = response.data.map((item: any) => {
      const sourcePlatform = url.includes('linkedin.com') ? 'linkedin' : 
                            url.includes('workopolis.com') ? 'workopolis' : 
                            'glassdoor'
      
      return {
        title: item.jobTitle || 'Titre non disponible',
        company: item.company || 'Entreprise non disponible',
        location: item.location || 'Lieu non disponible',
        description: item.description || '',
        url: item.url || url,
        source_platform: sourcePlatform,
        salary_range: item.salary || undefined,
        job_type: item.jobType || undefined,
        application_url: item.url || url,
        skills: extractSkills(item.description || ''),
        requirements: extractRequirements(item.description || '')
      }
    })

    console.log(`Successfully extracted ${jobs.length} jobs from ${url}`)
    return jobs
  } catch (error) {
    console.error('Error scraping website:', error)
    return []
  }
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
    'sql', 'nosql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git',
    'html', 'css', 'typescript', 'php', 'ruby', 'c++', 'c#', '.net',
  ]

  const skills = new Set<string>()
  const descLower = description.toLowerCase()

  commonSkills.forEach(skill => {
    if (descLower.includes(skill)) {
      skills.add(skill)
    }
  })

  return Array.from(skills)
}

function extractRequirements(description: string): string[] {
  const requirements: string[] = []
  const lines = description.split(/[.•\n]/)

  lines.forEach(line => {
    line = line.trim()
    if (
      line.toLowerCase().includes('required') ||
      line.toLowerCase().includes('requirement') ||
      line.toLowerCase().includes('must have') ||
      line.toLowerCase().includes('qualifi')
    ) {
      requirements.push(line)
    }
  })

  return requirements
}

async function saveJobsToDatabase(jobs: JobListing[], supabase: any) {
  try {
    const { data, error } = await supabase
      .from('scraped_jobs')
      .upsert(
        jobs.map(job => ({
          ...job,
          updated_at: new Date(),
          created_at: new Date(),
        })),
        { onConflict: 'url' }
      )

    if (error) {
      console.error('Error saving jobs to database:', error)
      throw error
    }

    console.log(`Successfully saved ${jobs.length} jobs to database`)
    return data
  } catch (error) {
    console.error('Error in saveJobsToDatabase:', error)
    throw error
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { urls } = await req.json()
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error('No URLs provided')
    }
    
    console.log('Starting job scraping for URLs:', urls)
    
    const allJobs: JobListing[] = []
    for (const url of urls) {
      const jobs = await scrapeJobsFromWebsite(url)
      allJobs.push(...jobs)
    }
    
    console.log(`Found ${allJobs.length} jobs in total`)
    
    if (allJobs.length > 0) {
      await saveJobsToDatabase(allJobs, supabase)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: allJobs.length,
        sources: urls
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in scrape-jobs function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
