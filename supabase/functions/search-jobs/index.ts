
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const rapidApiHost = 'jsearch.p.rapidapi.com';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, page = 1, num_pages = 1 } = await req.json()
    
    // Get RapidAPI key from Supabase secrets
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: secretData } = await supabaseClient
      .rpc('get_secret', { secret_name: 'RAPIDAPI_KEY' })
    
    if (!secretData?.secret) {
      throw new Error('API key not found')
    }

    const rapidApiKey = secretData.secret

    // Call RapidAPI
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${num_pages}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': rapidApiHost,
          'X-RapidAPI-Key': rapidApiKey,
        },
      }
    )

    const data = await response.json()
    
    // Log for debugging
    console.log(`Job search completed. Found ${data.data?.length || 0} results`)

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in search-jobs function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
