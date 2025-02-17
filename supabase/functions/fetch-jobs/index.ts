
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JoobleJob {
  id: string;
  title: string;
  location: string;
  company: string;
  salary: string;
  description: string;
  link: string;
  type: string;
  updated: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const JOOBLE_API_KEY = Deno.env.get('JOOBLE_API_KEY')
    if (!JOOBLE_API_KEY) {
      throw new Error('JOOBLE_API_KEY is required')
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are required')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch jobs from Jooble API
    const response = await fetch('https://jooble.org/api/ad6cb3e2-5abf-4c07-a944-d5e82afeafc6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keywords: "software developer",
        location: "Canada",
        salary: "50000",
      })
    })

    const { jobs } = await response.json()

    // Process and insert jobs
    const processedJobs = jobs.map((job: JoobleJob) => ({
      external_id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      external_url: job.link,
      source_platform: 'jooble',
      posted_at: new Date(job.updated).toISOString(),
      employment_type: job.type,
      salary_range: job.salary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Insert jobs into Supabase
    const { error } = await supabase
      .from('scraped_jobs')
      .upsert(processedJobs, {
        onConflict: 'external_id,source_platform',
        ignoreDuplicates: true
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, jobsProcessed: processedJobs.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
