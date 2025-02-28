
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
    const { query, userProfile, jobContext } = await req.json()
    
    console.log('Received request:', { query, userProfile })

    const messages = [{
      role: 'user',
      content: query
    }]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://victaure.com',
        'X-Title': 'Victaure Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'system',
            content: `Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement. 
                     Tu es amical, professionnel et serviable. Tu communiques en français.
                     Tu aides les utilisateurs à trouver des emplois, améliorer leur CV et leurs compétences professionnelles.
                     Tu donnes des conseils concrets et personnalisés.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenRouter response:', data)

    // Extract the assistant's message from the response
    const assistantMessage = data.choices?.[0]?.message?.content || 
                           "Désolé, je n'ai pas pu générer une réponse appropriée."

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        details: error.message,
        response: "Je suis désolé, mais je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
