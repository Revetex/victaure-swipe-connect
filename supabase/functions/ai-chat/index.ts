
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyCqMr40vAdnb7oPTXwAiXxntumGrLdzLZA";

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

    // Utilisation de l'API Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{
              text: `Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement. 
                     Tu es amical, professionnel et serviable. Tu communiques en français.
                     Tu aides les utilisateurs à trouver des emplois, améliorer leur CV et leurs compétences professionnelles.
                     Tu donnes des conseils concrets et personnalisés.
                     
                     Réponds à cette question: ${query}`
            }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1000,
        }
      })
    })

    if (!response.ok) {
      console.error('Gemini API error:', response.status)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Gemini response:', data)

    // Extract the assistant's message from the response
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 
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
