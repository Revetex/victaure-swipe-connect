import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { profile } = await req.json()

    // Create a prompt based on profile information
    const prompt = `Generate a professional, concise slogan (max 6 words) for a business card that reflects this person's role and expertise. Here's their profile:
    Role: ${profile.role}
    Skills: ${profile.skills?.join(', ')}
    Bio: ${profile.bio}
    Make it sound professional and memorable.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional slogan generator. Create concise, impactful slogans that capture the essence of a professional\'s expertise.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const slogan = data.choices[0].message.content.replace(/["']/g, '')

    return new Response(
      JSON.stringify({ slogan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})