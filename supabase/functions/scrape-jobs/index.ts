
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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

    const jobSites = [
      'https://ca.indeed.com/emplois?l=Quebec&sc=0kf%3Ajt%28fulltime%29%3B&lang=fr',
      'https://www.jobillico.com/recherche-emploi?skwd=&wloc=Quebec'
    ]

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const jobs = []
    for (const url of jobSites) {
      console.log(`Scraping jobs from: ${url}`)
      
      try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)
        
        if (url.includes('indeed.com')) {
          $('.job_seen_beacon').each((_, element) => {
            const title = $(element).find('.jobTitle').text().trim()
            const company = $(element).find('.companyName').text().trim()
            const location = $(element).find('.companyLocation').text().trim()
            const description = $(element).find('.job-snippet').text().trim()
            const salary = $(element).find('.salary-snippet').text().trim()
            const link = 'https://ca.indeed.com' + $(element).find('a').first().attr('href')
            
            if (title) {
              jobs.push({
                title,
                company,
                location,
                description,
                salary_range: salary,
                url: link,
                source_platform: 'indeed',
                employment_type: 'FULL_TIME'
              })
            }
          })
        } else if (url.includes('jobillico.com')) {
          $('.job-item').each((_, element) => {
            const title = $(element).find('.job-title').text().trim()
            const company = $(element).find('.company-name').text().trim()
            const location = $(element).find('.location').text().trim()
            const description = $(element).find('.description').text().trim()
            const link = 'https://www.jobillico.com' + $(element).find('a').first().attr('href')
            
            if (title) {
              jobs.push({
                title,
                company,
                location,
                description,
                url: link,
                source_platform: 'jobillico',
                employment_type: 'FULL_TIME'
              })
            }
          })
        }
      } catch (error) {
        console.error(`Error scraping ${url}:`, error)
      }
    }

    console.log(`Found ${jobs.length} jobs total`)

    let savedCount = 0
    for (const job of jobs) {
      try {
        const { error } = await supabase
          .from('scraped_jobs')
          .upsert({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salary_range: job.salary_range,
            url: job.url,
            posted_at: new Date().toISOString(),
            source_platform: job.source_platform,
            employment_type: job.employment_type,
            last_checked: new Date().toISOString()
          }, {
            onConflict: 'url'
          })

        if (error) {
          console.error('Error saving job:', error)
        } else {
          savedCount++
        }
      } catch (error) {
        console.error('Error processing job:', error)
      }
    }

    console.log(`Successfully saved ${savedCount} jobs`)

    return new Response(JSON.stringify({
      success: true,
      jobsFound: jobs.length,
      jobsSaved: savedCount
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
