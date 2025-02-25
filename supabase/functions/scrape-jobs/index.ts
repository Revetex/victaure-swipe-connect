
import { createClient } from '@supabase/supabase-js'
import cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPPORTED_SITES = {
  'jobboom.com': {
    title: '.job-title, h1',
    company: '.company-name, .employer-name',
    location: '.location',
    description: '.job-description',
    salary: '.salary',
    type: '.job-type'
  },
  'jobillico.com': {
    title: '.offer-title, h1',
    company: '.company-name',
    location: '.location',
    description: '#description',
    salary: '.salary-range',
    type: '.employment-type'
  },
  'joblist.com': {
    title: '.posting-title, h1',
    company: '.company-info',
    location: '.location',
    description: '.description',
    salary: '.compensation',
    type: '.employment-type'
  },
  'guichetemplois.gc.ca': {
    title: '.title, h1',
    company: '.business-name',
    location: '.location',
    description: '#job-description',
    salary: '.salary',
    type: '.work-type'
  },
  'quebecemploi.gouv.qc.ca': {
    title: '.job-title, h1',
    company: '.employer-name',
    location: '.location',
    description: '.description',
    salary: '.salary-info',
    type: '.job-type'
  }
};

const getSiteSelectors = (url: string) => {
  const hostname = new URL(url).hostname;
  return Object.entries(SUPPORTED_SITES).find(([domain]) => hostname.includes(domain))?.[1];
};

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

    const selectors = getSiteSelectors(url);
    if (!selectors) {
      return new Response(
        JSON.stringify({ error: 'Unsupported job site' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Starting job search process...');
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    
    const scrapedJob = {
      url,
      title: $(selectors.title).first().text().trim() || 'Unknown Title',
      company: $(selectors.company).first().text().trim(),
      location: $(selectors.location).first().text().trim(),
      description: $(selectors.description).first().text().trim(),
      salary_range: $(selectors.salary).first().text().trim(),
      job_type: $(selectors.type).first().text().trim(),
      source: new URL(url).hostname,
      raw_data: {
        fullHtml: html,
        timestamp: new Date().toISOString()
      }
    }

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
