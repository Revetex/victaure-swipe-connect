import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { profile } = await req.json()

    // Construct a prompt based on the profile information
    const prompt = `Generate a professional, concise slogan (maximum 6 words) for a business card based on this professional profile:
    Name: ${profile.full_name}
    Role: ${profile.role}
    Skills: ${profile.skills?.join(', ')}
    Bio: ${profile.bio}
    
    The slogan should be elegant, memorable, and reflect their expertise and professional identity.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional branding expert that creates concise, impactful slogans.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    const slogan = data.choices[0].message.content.replace(/["']/g, '')

    return new Response(
      JSON.stringify({ slogan }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})