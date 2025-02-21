
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { load } from "cheerio"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobListing {
  id?: string
  title: string
  company: string
  location: string
  salary?: string
  description: string
  url: string
  source: string
  posted_at: Date
  skills?: string[]
  external_id: string
  experience_level?: string
  contract_type?: string
  remote_type?: 'full' | 'hybrid' | 'office'
  salary_min?: number
  salary_max?: number
  currency?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const jobSites = [
      {
        url: 'https://emplois.ca.indeed.com/jobs?l=Quebec',
        scraper: scrapeIndeed,
        name: 'indeed'
      },
      {
        url: 'https://www.jobillico.com/recherche-emploi?skwd=&scty=Quebec',
        scraper: scrapeJobillico,
        name: 'jobillico'
      },
      {
        url: 'https://www.linkedin.com/jobs/search/?location=Quebec',
        scraper: scrapeLinkedIn,
        name: 'linkedin'
      }
    ]

    const allJobs: JobListing[] = []

    for (const site of jobSites) {
      try {
        console.log(`Scraping ${site.name}...`)
        const response = await fetch(site.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        const html = await response.text()
        const jobs = await site.scraper(html)
        allJobs.push(...jobs)
      } catch (error) {
        console.error(`Error scraping ${site.url}:`, error)
      }
    }

    // Déduplications basées sur le titre et l'entreprise
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex((j) => (
        j.title === job.title && j.company === job.company
      ))
    )

    // Sauvegarder dans Supabase
    const { error } = await supabaseAdmin
      .from('scraped_jobs')
      .upsert(
        uniqueJobs.map(job => ({
          ...job,
          external_id: `${job.source}-${btoa(job.title + job.company)}`,
          created_at: new Date().toISOString()
        })),
        {
          onConflict: 'external_id',
          ignoreDuplicates: true
        }
      )

    if (error) throw error

    return new Response(JSON.stringify({
      message: `Successfully scraped ${uniqueJobs.length} unique jobs`,
      jobs: uniqueJobs
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error scraping jobs:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function scrapeIndeed(html: string): Promise<JobListing[]> {
  const $ = load(html)
  const jobs: JobListing[] = []

  $('.job_seen_beacon').each((_, element) => {
    const title = $(element).find('.jobTitle').text().trim()
    const company = $(element).find('.companyName').text().trim()
    const location = $(element).find('.companyLocation').text().trim()
    const salary = $(element).find('.salary-snippet').text().trim()
    const description = $(element).find('.job-snippet').text().trim()
    const url = 'https://emplois.ca.indeed.com' + $(element).find('a').attr('href')
    
    if (title && company) {
      jobs.push({
        title,
        company,
        location,
        salary,
        description,
        url,
        source: 'indeed',
        posted_at: new Date(),
        skills: extractSkills(description),
        external_id: `indeed-${btoa(title + company)}`,
        experience_level: extractExperienceLevel(description),
        contract_type: extractContractType(description),
        remote_type: extractRemoteType(description),
        ...extractSalaryRange(salary)
      })
    }
  })

  return jobs
}

async function scrapeJobillico(html: string): Promise<JobListing[]> {
  const $ = load(html)
  const jobs: JobListing[] = []

  $('.job-item').each((_, element) => {
    const title = $(element).find('.job-title').text().trim()
    const company = $(element).find('.company-name').text().trim()
    const location = $(element).find('.job-location').text().trim()
    const description = $(element).find('.job-description').text().trim()
    const salary = $(element).find('.job-salary').text().trim()
    const url = 'https://www.jobillico.com' + $(element).find('a').attr('href')

    if (title && company) {
      jobs.push({
        title,
        company,
        location,
        salary,
        description,
        url,
        source: 'jobillico',
        posted_at: new Date(),
        skills: extractSkills(description),
        external_id: `jobillico-${btoa(title + company)}`,
        experience_level: extractExperienceLevel(description),
        contract_type: extractContractType(description),
        remote_type: extractRemoteType(description),
        ...extractSalaryRange(salary)
      })
    }
  })

  return jobs
}

async function scrapeLinkedIn(html: string): Promise<JobListing[]> {
  const $ = load(html)
  const jobs: JobListing[] = []

  $('.job-search-card').each((_, element) => {
    const title = $(element).find('.job-title').text().trim()
    const company = $(element).find('.company-name').text().trim()
    const location = $(element).find('.job-location').text().trim()
    const description = $(element).find('.job-description').text().trim()
    const url = $(element).find('a').attr('href') || ''

    if (title && company) {
      jobs.push({
        title,
        company,
        location,
        description,
        url,
        source: 'linkedin',
        posted_at: new Date(),
        skills: extractSkills(description),
        external_id: `linkedin-${btoa(title + company)}`,
        experience_level: extractExperienceLevel(description),
        contract_type: extractContractType(description),
        remote_type: extractRemoteType(description)
      })
    }
  })

  return jobs
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'SQL', 'React', 'Angular', 'Node.js',
    'TypeScript', 'C#', 'PHP', 'Docker', 'AWS', 'Azure', 'Git', 'Excel',
    'Word', 'PowerPoint', 'Communication', 'Gestion de projet', 'Agile', 
    'Scrum', 'Marketing', 'Ventes', 'Service client', 'Leadership',
    'Français', 'Anglais', 'Bilingue', 'SAP', 'Salesforce', 'Adobe',
    'AutoCAD', 'Revit', 'Coordination', 'Négociation', 'Analyse'
  ]

  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  )
}

function extractExperienceLevel(description: string): string {
  const levels = {
    junior: ['junior', 'débutant', '0-2 ans', '1-3 ans'],
    intermediate: ['intermédiaire', '2-5 ans', '3-5 ans', '4-6 ans'],
    senior: ['senior', 'confirmé', '5+ ans', '6+ ans', '7+ ans', '8+ ans']
  }

  for (const [level, keywords] of Object.entries(levels)) {
    if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return level
    }
  }

  return 'non_specified'
}

function extractContractType(description: string): string {
  const types = {
    permanent: ['permanent', 'cdi', 'temps plein'],
    temporary: ['temporaire', 'cdd', 'contrat', 'temps partiel'],
    internship: ['stage', 'stagiaire', 'étudiant'],
    freelance: ['freelance', 'consultant', 'travailleur autonome']
  }

  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return type
    }
  }

  return 'non_specified'
}

function extractRemoteType(description: string): 'full' | 'hybrid' | 'office' {
  if (description.toLowerCase().includes('100% télétravail') || 
      description.toLowerCase().includes('full remote')) {
    return 'full'
  }
  if (description.toLowerCase().includes('hybride') || 
      description.toLowerCase().includes('flexible')) {
    return 'hybrid'
  }
  return 'office'
}

function extractSalaryRange(salary: string): { salary_min?: number; salary_max?: number; currency?: string } {
  const result = {
    salary_min: undefined as number | undefined,
    salary_max: undefined as number | undefined,
    currency: undefined as string | undefined
  }

  if (!salary) return result

  // Nettoyer la chaîne de caractères
  const cleanSalary = salary.replace(/\s+/g, ' ').trim()

  // Détecter la devise
  if (cleanSalary.includes('$')) {
    result.currency = 'CAD'
  } else if (cleanSalary.includes('€')) {
    result.currency = 'EUR'
  }

  // Extraire les nombres
  const numbers = cleanSalary.match(/\d+([.,]\d+)?/g)
  if (!numbers) return result

  // Convertir en nombres et trouver min/max
  const salaryNumbers = numbers.map(n => parseFloat(n.replace(',', '.')))
  
  if (salaryNumbers.length === 1) {
    result.salary_min = result.salary_max = salaryNumbers[0]
  } else if (salaryNumbers.length >= 2) {
    result.salary_min = Math.min(...salaryNumbers)
    result.salary_max = Math.max(...salaryNumbers)
  }

  // Ajuster selon la période si nécessaire
  if (cleanSalary.includes('heure')) {
    result.salary_min = result.salary_min ? result.salary_min * 40 * 52 : undefined
    result.salary_max = result.salary_max ? result.salary_max * 40 * 52 : undefined
  } else if (cleanSalary.includes('mois')) {
    result.salary_min = result.salary_min ? result.salary_min * 12 : undefined
    result.salary_max = result.salary_max ? result.salary_max * 12 : undefined
  }

  return result
}
