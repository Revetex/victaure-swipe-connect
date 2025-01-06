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
    const { message } = await req.json()
    console.log('Received message:', message)

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      console.error('Missing Hugging Face API key')
      throw new Error('Configuration error: Missing API key')
    }

    console.log('Sending request to Hugging Face API...')
    const response = await fetch('https://api.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Québec. 
                Sois concis et direct dans tes réponses.
                
                User: ${message}
                
                Assistant:`,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.5,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          return_full_text: false
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', errorText)
      throw new Error(`Hugging Face API error: ${response.statusText}. Details: ${errorText}`)
    }

    const data = await response.json()
    console.log('AI response:', data)

    const assistantResponse = data[0].generated_text.split('Assistant:').pop()?.trim()

    return new Response(
      JSON.stringify({ response: assistantResponse || data[0].generated_text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in AI chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})