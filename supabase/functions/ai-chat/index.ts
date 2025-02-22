
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    console.log('Sending request to OpenRouter with messages:', messages)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://victaure.com',
        'X-Title': 'Victaure Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-llama2-70b',
        messages: [
          {
            role: 'system',
            content: `Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement. 
                     Tu es amical, professionnel et serviable. Tu communiques en français.
                     Tu aides les utilisateurs à trouver des emplois, améliorer leur CV et leurs compétences professionnelles.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received response from OpenRouter:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
