
import { createClient } from '@supabase/supabase-js'
import * as puppeteer from 'puppeteer'

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

    // Création d'une instance de navigateur avec la bonne syntaxe pour Deno
    const browser = await puppeteer.default.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    console.log('Browser launched successfully')

    // Configuration pour Indeed Québec
    await page.goto('https://ca.indeed.com/jobs?l=Quebec&sc=0kf%3Ajt%28fulltime%29%3B&lang=fr')
    await page.waitForSelector('.job_seen_beacon', { timeout: 10000 })
    console.log('Page loaded successfully')

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.job_seen_beacon')
      console.log(`Found ${jobCards.length} job cards`)
      
      return Array.from(jobCards, card => {
        const titleElement = card.querySelector('.jobTitle')
        const companyElement = card.querySelector('.companyName')
        const locationElement = card.querySelector('.companyLocation')
        const snippetElement = card.querySelector('.job-snippet')
        const salaryElement = card.querySelector('.salary-snippet')
        const dateElement = card.querySelector('.date')
        const urlElement = card.querySelector('h2.jobTitle a') as HTMLAnchorElement

        console.log('Processing job:', titleElement?.textContent)

        const experienceMatch = snippetElement?.textContent?.match(/(\d+).*?ans?.*?expérience/i)
        const skillsMatch = snippetElement?.textContent?.match(/compétences?:?\s*([^.]+)/i)

        return {
          title: titleElement?.textContent?.trim() || '',
          company: companyElement?.textContent?.trim() || '',
          location: locationElement?.textContent?.trim() || '',
          description: snippetElement?.textContent?.trim() || '',
          salary_range: salaryElement?.textContent?.trim(),
          url: urlElement?.href || '',
          posted_at: new Date().toISOString(),
          source_platform: 'indeed',
          employment_type: 'FULL_TIME',
          experience_level: experienceMatch ? `${experienceMatch[1]}_years` : 'not_specified',
          skills: skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : []
        }
      })
    })

    await browser.close()
    console.log(`Found ${jobs.length} jobs, saving to database...`)

    // Connexion à Supabase avec la clé de service
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
            salary_range: job.salary_range,
            url: job.url,
            posted_at: job.posted_at,
            source_platform: job.source_platform,
            employment_type: job.employment_type,
            experience_level: job.experience_level,
            skills: job.skills,
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
