
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import { chromium } from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

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
  requirements?: string[]
}

async function scrapeLinkedInJobs(page: any, searchUrl: string): Promise<JobListing[]> {
  console.log('Scraping LinkedIn jobs from:', searchUrl)
  
  await page.goto(searchUrl)
  await page.waitForSelector('.jobs-search__results-list')

  const jobs = await page.evaluate(() => {
    const listings = document.querySelectorAll('.jobs-search__results-list > li')
    return Array.from(listings).map(listing => {
      const titleEl = listing.querySelector('.job-card-list__title')
      const companyEl = listing.querySelector('.job-card-container__company-name')
      const locationEl = listing.querySelector('.job-card-container__metadata-item')
      const urlEl = listing.querySelector('a.job-card-list__title')
      
      return {
        title: titleEl?.textContent?.trim() || '',
        company: companyEl?.textContent?.trim() || '',
        location: locationEl?.textContent?.trim() || '',
        url: urlEl?.href || '',
        source_platform: 'linkedin' as const
      }
    })
  })

  // Pour chaque job, récupérer les détails
  const detailedJobs: JobListing[] = []
  for (const job of jobs.slice(0, 25)) { // Limite à 25 jobs pour des raisons de performance
    try {
      await page.goto(job.url)
      await page.waitForSelector('.jobs-description')
      
      const details = await page.evaluate(() => {
        const descriptionEl = document.querySelector('.jobs-description')
        const jobTypeEl = document.querySelector('.jobs-unified-top-card__job-insight span')
        const salaryEl = document.querySelector('.jobs-unified-top-card__salary-range')
        
        return {
          description: descriptionEl?.textContent?.trim() || '',
          job_type: jobTypeEl?.textContent?.trim(),
          salary_range: salaryEl?.textContent?.trim()
        }
      })
      
      detailedJobs.push({
        ...job,
        ...details,
        skills: extractSkills(details.description),
        requirements: extractRequirements(details.description)
      })
      
    } catch (error) {
      console.error(`Error scraping details for job ${job.url}:`, error)
      detailedJobs.push(job as JobListing)
    }
  }

  return detailedJobs
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

  let browser
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { searchTerms, location } = await req.json()
    if (!searchTerms || !location) {
      throw new Error('Search terms and location are required')
    }
    
    console.log(`Starting job search for "${searchTerms}" in ${location}`)
    
    // Initialiser le navigateur
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    
    // Construire l'URL de recherche LinkedIn
    const encodedSearchTerms = encodeURIComponent(searchTerms)
    const encodedLocation = encodeURIComponent(location)
    const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedSearchTerms}&location=${encodedLocation}`
    
    // Scraper les jobs
    const linkedInJobs = await scrapeLinkedInJobs(page, linkedInUrl)
    console.log(`Found ${linkedInJobs.length} LinkedIn jobs`)
    
    // Sauvegarder dans la base de données
    if (linkedInJobs.length > 0) {
      await saveJobsToDatabase(linkedInJobs, supabase)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: linkedInJobs.length,
        message: `Successfully scraped ${linkedInJobs.length} jobs`
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
  } finally {
    if (browser) {
      await browser.close()
    }
  }
})
