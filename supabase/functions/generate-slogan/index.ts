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

    const prompt = `Generate a professional, concise slogan (maximum 6 words) for a business card based on this professional profile:
    Name: ${profile.full_name}
    Role: ${profile.role}
    Skills: ${profile.skills?.join(', ')}
    Bio: ${profile.bio}
    
    The slogan should be elegant, memorable, and reflect their expertise and professional identity.
    Only return the slogan, nothing else.`

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Hugging Face API Error:', error)
      throw new Error('Failed to generate slogan')
    }

    const data = await response.json()
    const slogan = data[0].generated_text.trim().split('\n')[0].replace(/["']/g, '')

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