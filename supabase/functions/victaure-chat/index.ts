
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
        'X-Title': 'Victaure Assistant',
        'Origin': 'https://victaure.com'
      },
      body: JSON.stringify({
        model: 'gemini-pro-vision',
        messages: [
          {
            role: 'system',
            content: 'Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement québécoise. Tu dois être amical et professionnel, répondre en français, et aider les utilisateurs avec leurs questions sur l\'emploi, le recrutement et la carrière.'
          },
          ...messages
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Response from Gemini:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
