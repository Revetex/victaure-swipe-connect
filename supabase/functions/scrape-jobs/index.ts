
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

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
  benefits?: string[]
  requirements?: string[]
}

async function scrapeLinkedInJobs(query: string, location: string): Promise<JobListing[]> {
  try {
    // Simulation de données pour le moment
    // À remplacer par une véritable intégration avec l'API LinkedIn
    console.log(`Simulating LinkedIn scraping for ${query} in ${location}`)
    
    return [{
      title: "Développeur Full Stack",
      company: "Tech Company Inc",
      location: "Montréal, QC",
      description: "Nous recherchons un développeur Full Stack expérimenté...",
      url: "https://linkedin.com/jobs/view/123",
      source_platform: "linkedin",
      job_type: "Temps plein",
      experience_level: "Intermédiaire",
      skills: ["JavaScript", "React", "Node.js"],
      requirements: ["3+ ans d'expérience", "Baccalauréat en informatique"],
    }]
  } catch (error) {
    console.error('Error scraping LinkedIn jobs:', error)
    return []
  }
}

async function scrapeWorkopolisJobs(query: string, location: string): Promise<JobListing[]> {
  try {
    // Simulation de données pour le moment
    // À remplacer par une véritable intégration avec l'API Workopolis
    console.log(`Simulating Workopolis scraping for ${query} in ${location}`)
    
    return [{
      title: "Développeur Backend Senior",
      company: "Digital Solutions Ltd",
      location: "Québec, QC",
      description: "Notre équipe recherche un développeur backend expérimenté...",
      url: "https://workopolis.com/jobs/456",
      source_platform: "workopolis",
      job_type: "Temps plein",
      experience_level: "Senior",
      skills: ["Python", "Django", "PostgreSQL"],
      requirements: ["5+ ans d'expérience", "Expérience en architecture logicielle"],
    }]
  } catch (error) {
    console.error('Error scraping Workopolis jobs:', error)
    return []
  }
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
    
    // Scrape jobs from multiple sources
    const linkedInJobs = await scrapeLinkedInJobs(query, location)
    const workopolisJobs = await scrapeWorkopolisJobs(query, location)
    
    const allJobs = [...linkedInJobs, ...workopolisJobs]
    console.log(`Found ${allJobs.length} jobs in total`)
    
    // Save jobs to database
    if (allJobs.length > 0) {
      await saveJobsToDatabase(allJobs, supabase)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        jobsFound: allJobs.length,
        sources: {
          linkedin: linkedInJobs.length,
          workopolis: workopolisJobs.length,
        }
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
