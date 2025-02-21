
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { load } from "cheerio"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobListing {
  title: string
  company: string
  location: string
  salary?: string
  description: string
  url: string
  source: string
  posted_at: Date
  skills?: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const jobSites = [
      {
        url: 'https://emplois.ca.indeed.com/jobs?l=Quebec',
        scraper: scrapeIndeed
      },
      // Ajoutez d'autres sites d'emploi ici
    ]

    const allJobs: JobListing[] = []

    for (const site of jobSites) {
      try {
        const response = await fetch(site.url)
        const html = await response.text()
        const jobs = await site.scraper(html)
        allJobs.push(...jobs)
      } catch (error) {
        console.error(`Error scraping ${site.url}:`, error)
      }
    }

    // Sauvegarder dans Supabase
    const { data, error } = await supabaseAdmin
      .from('scraped_jobs')
      .upsert(allJobs, {
        onConflict: 'external_id',
        ignoreDuplicates: true
      })

    if (error) throw error

    return new Response(JSON.stringify({
      message: `Successfully scraped ${allJobs.length} jobs`,
      jobs: allJobs
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
        salary: salary || undefined,
        description,
        url,
        source: 'indeed',
        posted_at: new Date(),
        skills: extractSkills(description)
      })
    }
  })

  return jobs
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'SQL', 'React', 'Angular', 'Node.js',
    'TypeScript', 'C#', 'PHP', 'Docker', 'AWS', 'Azure', 'Git',
    'Communication', 'Gestion de projet', 'Agile', 'Scrum'
  ]

  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  )
}
