
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
  source_platform: string
  salary_range?: string
  job_type?: string
  application_url?: string
  experience_level?: string
  skills?: string[]
  requirements?: string[]
}

const jobSources = {
  jobbank: {
    baseUrl: 'https://www.guichetemplois.gc.ca/jobsearch/rechercheemplois',
    selectors: {
      jobList: '.results-jobs article',
      title: '.noctitle',
      company: '.business',
      location: '.location',
      description: '#job-details-content',
      salary: '.salary-info'
    }
  },
  jobboom: {
    baseUrl: 'https://www.jobboom.com/fr/emploi',
    selectors: {
      jobList: '.job-list-item',
      title: '.job-title',
      company: '.company-name',
      location: '.location',
      description: '.job-description',
      salary: '.salary'
    }
  },
  jobillico: {
    baseUrl: 'https://www.jobillico.com/recherche-emploi',
    selectors: {
      jobList: '.job-item',
      title: '.job-title',
      company: '.company',
      location: '.location',
      description: '.description',
      salary: '.salary'
    }
  },
  randstad: {
    baseUrl: 'https://www.randstad.ca/fr/emplois',
    selectors: {
      jobList: '.job-listing',
      title: '.job-title',
      company: '.client-name',
      location: '.location',
      description: '.job-description',
      salary: '.salary-range'
    }
  },
  indeed: {
    baseUrl: 'https://ca.indeed.com/jobs',
    selectors: {
      jobList: '.job_seen_beacon',
      title: '.jobTitle',
      company: '.companyName',
      location: '.companyLocation',
      description: '.job-snippet',
      salary: '.salary-snippet'
    }
  },
  ziprecruiter: {
    baseUrl: 'https://www.ziprecruiter.ca/Jobs',
    selectors: {
      jobList: '.job_content',
      title: '.job_title',
      company: '.hiring_company',
      location: '.location',
      description: '.job_description',
      salary: '.salary'
    }
  }
}

async function scrapeJobs(page: any, source: string, searchUrl: string): Promise<JobListing[]> {
  console.log(`Scraping jobs from ${source}: ${searchUrl}`)
  
  const sourceConfig = jobSources[source]
  if (!sourceConfig) {
    console.error(`No configuration found for source: ${source}`)
    return []
  }

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle0' })
    await page.waitForSelector(sourceConfig.selectors.jobList, { timeout: 10000 })

    const jobs = await page.evaluate((selectors) => {
      const listings = document.querySelectorAll(selectors.jobList)
      return Array.from(listings).map(listing => {
        const titleEl = listing.querySelector(selectors.title)
        const companyEl = listing.querySelector(selectors.company)
        const locationEl = listing.querySelector(selectors.location)
        const urlEl = listing.querySelector('a')
        const salaryEl = listing.querySelector(selectors.salary)
        
        return {
          title: titleEl?.textContent?.trim() || '',
          company: companyEl?.textContent?.trim() || '',
          location: locationEl?.textContent?.trim() || '',
          url: urlEl?.href || '',
          salary_range: salaryEl?.textContent?.trim() || '',
          description: '',  // Will be filled in detail scraping
          source_platform: source
        }
      })
    }, sourceConfig.selectors)

    // Limit to first 10 jobs per source for performance
    const limitedJobs = jobs.slice(0, 10)

    // Get details for each job
    const detailedJobs = []
    for (const job of limitedJobs) {
      try {
        await page.goto(job.url, { waitUntil: 'networkidle0' })
        await page.waitForSelector(sourceConfig.selectors.description, { timeout: 5000 })

        const details = await page.evaluate((selectors) => {
          const descriptionEl = document.querySelector(selectors.description)
          return {
            description: descriptionEl?.textContent?.trim() || '',
          }
        }, sourceConfig.selectors)

        detailedJobs.push({
          ...job,
          description: details.description,
          skills: extractSkills(details.description),
          requirements: extractRequirements(details.description)
        })

        // Petit délai pour éviter de surcharger les serveurs
        await page.waitForTimeout(1000)
      } catch (error) {
        console.error(`Error scraping details for job ${job.url}:`, error)
        detailedJobs.push(job)
      }
    }

    return detailedJobs
  } catch (error) {
    console.error(`Error scraping ${source}:`, error)
    return []
  }
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
    'sql', 'nosql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git',
    'html', 'css', 'typescript', 'php', 'ruby', 'c++', 'c#', '.net',
    'excel', 'word', 'powerpoint', 'français', 'anglais', 'bilingue'
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

  const requirementKeywords = [
    'required', 'requirement', 'must have', 'qualifi',
    'requis', 'exigence', 'obligatoire', 'nécessaire'
  ]

  lines.forEach(line => {
    line = line.trim()
    if (requirementKeywords.some(keyword => 
      line.toLowerCase().includes(keyword)
    )) {
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

function buildSearchUrl(source: string, searchTerms: string, location: string): string {
  const config = jobSources[source]
  if (!config) return ''

  const encodedTerms = encodeURIComponent(searchTerms)
  const encodedLocation = encodeURIComponent(location)

  switch (source) {
    case 'jobbank':
      return `${config.baseUrl}?searchstring=${encodedTerms}&location=${encodedLocation}`
    case 'jobboom':
      return `${config.baseUrl}?keywords=${encodedTerms}&location=${encodedLocation}`
    case 'jobillico':
      return `${config.baseUrl}?q=${encodedTerms}&l=${encodedLocation}`
    case 'randstad':
      return `${config.baseUrl}/search/${encodedTerms}/${encodedLocation}`
    case 'indeed':
      return `${config.baseUrl}?q=${encodedTerms}&l=${encodedLocation}`
    case 'ziprecruiter':
      return `${config.baseUrl}/Search?search=${encodedTerms}&location=${encodedLocation}`
    default:
      return ''
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let browser
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { searchTerms = "développeur", location = "Québec", sources, isAssistantRequest = false } = await req.json()
    
    console.log(`Starting job search for "${searchTerms}" in ${location}`)
    
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    
    // Configure browser to appear more human
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    await page.setViewport({ width: 1920, height: 1080 })
    
    const allJobs: JobListing[] = []
    
    // Determine which sources to scrape
    const sourcesToScrape = sources || Object.keys(jobSources)
    
    // Scrape each source
    for (const source of sourcesToScrape) {
      try {
        const searchUrl = buildSearchUrl(source, searchTerms, location)
        if (!searchUrl) continue

        console.log(`Scraping ${source} with URL: ${searchUrl}`)
        const jobs = await scrapeJobs(page, source, searchUrl)
        allJobs.push(...jobs)
        
        // Small delay between sources
        await page.waitForTimeout(2000)
      } catch (error) {
        console.error(`Error scraping ${source}:`, error)
        continue
      }
    }
    
    console.log(`Total jobs found: ${allJobs.length}`)
    
    if (allJobs.length > 0) {
      await saveJobsToDatabase(allJobs, supabase)
    }
    
    // Format response based on request type
    const response = isAssistantRequest ? {
      success: true,
      jobsFound: allJobs.length,
      jobs: allJobs.slice(0, 5), // Return only first 5 jobs for assistant responses
      message: `J'ai trouvé ${allJobs.length} emplois correspondant à votre recherche.`
    } : {
      success: true,
      jobsFound: allJobs.length,
      message: `${allJobs.length} emplois trouvés et sauvegardés dans la base de données`
    }
    
    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in scraping function:', error)
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
