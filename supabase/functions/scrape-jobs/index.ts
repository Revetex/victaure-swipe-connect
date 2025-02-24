
import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')

    // URLs des sites d'emploi à scraper
    const jobSites = [
      'https://ca.indeed.com/emplois?l=Quebec&sc=0kf%3Ajt%28fulltime%29%3B&lang=fr',
      'https://www.linkedin.com/jobs/search/?location=Quebec',
      'https://www.jobillico.com/recherche-emploi?skwd=&wloc=Quebec'
    ]

    const jobs = []
    for (const url of jobSites) {
      console.log(`Scraping jobs from: ${url}`)
      
      const response = await fetch(url)
      const html = await response.text()
      const $ = cheerio.load(html)
      
      // Scraping spécifique à Indeed
      if (url.includes('indeed.com')) {
        $('.job_seen_beacon').each((i, el) => {
          const title = $(el).find('.jobTitle').text().trim()
          const company = $(el).find('.companyName').text().trim()
          const location = $(el).find('.companyLocation').text().trim()
          const description = $(el).find('.job-snippet').text().trim()
          const jobUrl = 'https://ca.indeed.com' + $(el).find('a').attr('href')
          
          if (title) {
            jobs.push({ title, company, location, description, url: jobUrl })
          }
        })
      }
      // Scraping spécifique à LinkedIn
      else if (url.includes('linkedin.com')) {
        $('.job-card-container').each((i, el) => {
          const title = $(el).find('.job-card-list__title').text().trim()
          const company = $(el).find('.job-card-container__company-name').text().trim()
          const location = $(el).find('.job-card-container__metadata-item').text().trim()
          
          if (title) {
            jobs.push({ title, company, location, url })
          }
        })
      }
      // Scraping spécifique à Jobillico
      else if (url.includes('jobillico.com')) {
        $('.job-item').each((i, el) => {
          const title = $(el).find('.job-title').text().trim()
          const company = $(el).find('.company-name').text().trim()
          const location = $(el).find('.job-location').text().trim()
          
          if (title) {
            jobs.push({ title, company, location, url })
          }
        })
      }
    }

    console.log(`Found ${jobs.length} jobs total`)

    // Sauvegarder dans Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    for (const job of jobs) {
      try {
        const { error } = await supabase
          .from('scraped_jobs')
          .upsert({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            posted_at: new Date().toISOString(),
            source_platform: 'web-scraping',
            employment_type: 'FULL_TIME',
            last_checked: new Date().toISOString()
          }, {
            onConflict: 'url'
          })

        if (error) {
          console.error('Error saving job:', error)
        }
      } catch (error) {
        console.error('Error processing job:', error)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      jobsFound: jobs.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in job scraping:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
