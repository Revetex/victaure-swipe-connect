
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const INDEED_API_KEY = Deno.env.get('INDEED_API_KEY')!

interface JobListing {
  title: string
  company: string
  location: string
  description: string
  url: string
  source_platform: 'indeed' | 'linkedin' | 'glassdoor' | 'workopolis'
  salary_range?: string
  job_type?: string
  application_url?: string
  experience_level?: string
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
}

async function scrapeIndeedJobs(query: string, location: string): Promise<JobListing[]> {
  try {
    const response = await fetch(
      `https://api.indeed.com/ads/apisearch?` +
      `publisher=${INDEED_API_KEY}&` +
      `q=${encodeURIComponent(query)}&` +
      `l=${encodeURIComponent(location)}&` +
      `format=json&` +
      `limit=25&` +
      `co=ca`
    )

    if (!response.ok) {
      console.error('Indeed API error:', await response.text())
      return []
    }

    const data = await response.json()
    return data.results.map((job: any) => ({
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      description: job.snippet,
      url: job.url,
      source_platform: 'indeed',
      salary_range: job.salary,
      job_type: job.jobtype,
      application_url: job.url,
      // Extraire les compétences et exigences de la description
      skills: extractSkills(job.snippet),
      requirements: extractRequirements(job.snippet),
    }))
  } catch (error) {
    console.error('Error scraping Indeed jobs:', error)
    return []
  }
}

function extractSkills(description: string): string[] {
  // Liste de compétences techniques courantes
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
    
    const { query = 'developer', location = 'Montreal' } = await req.json()
    
    console.log(`Scraping jobs for query: ${query}, location: ${location}`)
    
    // Scrape jobs from Indeed
    const indeedJobs = await scrapeIndeedJobs(query, location)
    console.log(`Found ${indeedJobs.length} jobs from Indeed`)
    
    // Save jobs to database
    if (indeedJobs.length > 0) {
      await saveJobsToDatabase(indeedJobs, supabase)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: indeedJobs.length,
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
