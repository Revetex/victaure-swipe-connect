
import { createClient } from '@supabase/supabase-js'
import { cheerio } from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedJob {
  url: string
  title: string
  company?: string
  location?: string
  description?: string
  salary_range?: string
  job_type?: string
  source: string
  raw_data: Record<string, any>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch the webpage
    const response = await fetch(url)
    const html = await response.text()
    
    // Use cheerio to parse the HTML
    const $ = cheerio.load(html)
    
    // Basic scraping logic - adjust selectors based on target sites
    const scrapedJob: ScrapedJob = {
      url,
      title: $('h1').first().text().trim() || 'Unknown Title',
      company: $('.company-name, [data-company]').first().text().trim(),
      location: $('.location, [data-location]').first().text().trim(),
      description: $('.description, [data-description]').first().text().trim(),
      salary_range: $('.salary, [data-salary]').first().text().trim(),
      job_type: $('.job-type, [data-job-type]').first().text().trim(),
      source: new URL(url).hostname,
      raw_data: {
        fullHtml: html,
        timestamp: new Date().toISOString()
      }
    }

    // Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabaseClient
      .from('crawled_jobs')
      .insert(scrapedJob)

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, data: scrapedJob }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
