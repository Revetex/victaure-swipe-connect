import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format')
    }

    const lastMessage = messages[messages.length - 1].content

    console.log('Sending request to Hugging Face API...')
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<s>[INST] Tu es Mr Victaure, un assistant professionnel qui aide les utilisateurs dans leur recherche d'emploi. Tu es précis, concis et bienveillant dans tes réponses.

Historique de la conversation:
${messages.slice(0, -1).map(m => `${m.role === 'assistant' ? 'Mr Victaure' : 'Utilisateur'}: ${m.content}`).join('\n')}

Message de l'utilisateur: ${lastMessage}

Réponds de manière professionnelle et concise. [/INST]`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.2,
          top_p: 0.95,
          return_full_text: false
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Hugging Face API error:', errorData)
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received response from Hugging Face:', data)

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format from Hugging Face:', data)
      throw new Error('Invalid response format from Hugging Face API')
    }
    
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: data[0].generated_text.trim()
        }
      }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})