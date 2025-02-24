
import { createClient } from '@supabase/supabase-js'
import FirecrawlApp from '@mendable/firecrawl-js'

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

    // Configuration de Firecrawl avec l'API key depuis les secrets
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in environment variables')
    }

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

    // URLs des sites d'emploi à scraper
    const jobSites = [
      'https://ca.indeed.com/emplois?l=Quebec&sc=0kf%3Ajt%28fulltime%29%3B&lang=fr',
      'https://www.linkedin.com/jobs/search/?location=Quebec',
      'https://www.jobillico.com/recherche-emploi?skwd=&wloc=Quebec'
    ]

    const jobs = []
    for (const url of jobSites) {
      console.log(`Scraping jobs from: ${url}`)
      
      const result = await firecrawl.crawlUrl(url, {
        limit: 50,
        scrapeOptions: {
          extract: [{
            name: 'jobs',
            selector: '.job-card, .job-listing, .jobsearch-SerpJobCard',
            multiple: true,
            fields: {
              title: '.title, .jobTitle, h2',
              company: '.company, .companyName',
              location: '.location, .companyLocation',
              description: '.description, .job-snippet',
              salary: '.salary, .salaryText',
              url: 'a[href]@href',
              posted_at: '.date, .posted-time'
            }
          }]
        }
      })

      if (result.success) {
        jobs.push(...result.data.jobs)
      }
    }

    console.log(`Found ${jobs.length} jobs total`)

    // Sauvegarder dans Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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
            salary_range: job.salary,
            url: job.url,
            posted_at: job.posted_at || new Date().toISOString(),
            source_platform: 'firecrawl',
            employment_type: 'FULL_TIME',
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
