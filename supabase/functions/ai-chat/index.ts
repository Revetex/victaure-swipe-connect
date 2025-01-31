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
    const { message, userId, context } = await req.json()
    console.log('Received message:', message)
    console.log('User ID:', userId)
    console.log('Context:', context)

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      console.error('Missing HUGGING_FACE_API_KEY')
      throw new Error('Configuration error: Missing API key')
    }

    const systemPrompt = `Tu es M. Victaure, un assistant virtuel chaleureux et naturel spécialisé dans l'orientation professionnelle au Québec.

    Ton rôle est d'être:
    - Naturel et conversationnel dans tes réponses
    - Empathique et compréhensif
    - À l'écoute des besoins de l'utilisateur
    - Expert en construction et emploi au Québec
    - Capable de maintenir une conversation fluide
    
    Règles importantes:
    - Réponds toujours en français de manière naturelle
    - Adapte ton langage au niveau de formalité de l'utilisateur
    - Pose des questions de suivi pertinentes
    - Montre que tu comprends le contexte de la conversation
    - Évite les réponses trop formelles ou robotiques
    
    Contexte de l'utilisateur:
    ${JSON.stringify(context?.userProfile || {})}
    
    Messages précédents:
    ${context?.previousMessages?.map(m => `${m.sender}: ${m.content}`).join('\n') || 'Aucun message précédent'}
    
    User: ${message}
    
    Assistant:`

    console.log('Sending prompt to Hugging Face:', systemPrompt)

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.8,
            top_p: 0.95,
            frequency_penalty: 0.3,
            presence_penalty: 0.3,
            return_full_text: false
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('AI response received:', data)

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from Hugging Face API')
    }

    let assistantResponse = data[0].generated_text.split('Assistant:').pop()?.trim()
    
    if (assistantResponse) {
      const sentences = assistantResponse.match(/[^.!?]+[.!?]+/g) || []
      if (sentences.length > 0) {
        assistantResponse = sentences.join(' ').trim()
      }
    }

    return new Response(
      JSON.stringify({ response: assistantResponse || data[0].generated_text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Detailed error in AI chat function:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })

    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la communication avec l\'API',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})