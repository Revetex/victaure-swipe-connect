
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
    const { messages, type = 'chat' } = await req.json()

    // Sélectionner le bon modèle selon le type de requête
    const model = type === 'chat' 
      ? 'google/gemini-2.0-pro-exp-02-05:free'
      : type === 'function' 
        ? 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free'
        : 'qwen/qwen2.5-vl-72b-instruct:free'

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
        model,
        messages: [
          {
            role: 'system',
            content: type === 'chat'
              ? 'Tu es Mr. Victaure, un assistant professionnel sur une plateforme de recrutement québécoise. Tu dois être amical et professionnel, répondre en français, et aider les utilisateurs avec leurs questions sur l\'emploi, le recrutement et la carrière.'
              : type === 'function'
                ? 'Tu es un assistant spécialisé dans l\'analyse de données et l\'exécution de fonctions complexes. Tu dois être précis et efficace.'
                : 'Tu es un assistant spécialisé dans l\'analyse et la génération d\'images. Tu dois être créatif tout en restant professionnel.'
          },
          ...messages
        ],
        ...(type === 'vision' && {
          max_tokens: 4096,
          temperature: 0.7
        })
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Response from AI:', data)

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
