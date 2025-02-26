
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey!)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Get content for AI context
    const [jobs, profiles, posts] = await Promise.all([
      supabase.from('jobs').select('*').limit(50),
      supabase.from('profiles').select('*').limit(50),
      supabase.from('posts').select('*').limit(50)
    ])

    // Prepare context for AI
    const context = {
      jobs: jobs.data || [],
      profiles: profiles.data || [],
      posts: posts.data || []
    }

    // Generate search prompt
    const prompt = `
    Based on the following query: "${query}"
    And this context data: ${JSON.stringify(context)}
    
    Please analyze and return the most relevant results.
    Consider:
    - Semantic relevance to the query
    - Content freshness
    - User engagement metrics
    
    Return only the 5 most relevant results in this format:
    {
      "results": [{
        "id": "uuid",
        "title": "title",
        "description": "short description",
        "type": "job|profile|post|service",
        "relevanceScore": 0.95, // between 0 and 1
        "metadata": {} // optional additional data
      }]
    }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Parse AI response
    const parsedResults = JSON.parse(text)

    console.log('Search results:', parsedResults)

    return new Response(
      JSON.stringify(parsedResults),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Error:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})
