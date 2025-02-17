
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchJob {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  source: string;
  posted_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const GOOGLE_SEARCH_API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY')
    if (!GOOGLE_SEARCH_API_KEY) {
      throw new Error('Google Search API key not found')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Recherche sur différents sites d'emploi
    const sites = [
      "emploiquebec.gouv.qc.ca",
      "linkedin.com/jobs",
      "indeed.ca",
      "jobillico.com"
    ]

    const siteQuery = sites.map(site => `site:${site}`).join(" OR ")
    const searchQuery = `emploi OR job quebec`
    
    console.log('Starting job search with query:', searchQuery)
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=1262c5460a0314a80&q=${encodeURIComponent(searchQuery + " " + siteQuery)}&num=10`

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!data.items) {
      console.log('No search results found')
      return new Response(
        JSON.stringify({ error: 'No jobs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${data.items.length} job listings`)

    const jobs: SearchJob[] = data.items.map((item: any) => ({
      title: item.title.replace(' | LinkedIn', '').replace(' | Indeed', ''),
      company: item.pagemap?.organization?.[0]?.name || 'Non spécifié',
      location: 'Québec',
      description: item.snippet,
      url: item.link,
      source: new URL(item.link).hostname,
      posted_at: new Date().toISOString()
    }))

    // Sauvegarde dans Supabase
    for (const job of jobs) {
      const { error } = await supabase
        .from('scraped_jobs')
        .upsert(
          {
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            url: job.url,
            source_platform: job.source,
            posted_at: job.posted_at
          },
          { onConflict: 'url' }
        )

      if (error) {
        console.error('Error saving job:', error)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped ${jobs.length} jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in smart-job-scraper:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
