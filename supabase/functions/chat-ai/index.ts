
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured')
    }

    const { message, userId, context } = await req.json()

    console.log('Processing request with context:', context)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.lovable.dev',
        'X-Title': 'Victaure'
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'system',
            content: `Tu es M. Victaure, un conseiller professionnel au Québec. Sois direct et simple :
            - Utilise des phrases courtes
            - Évite le jargon professionnel
            - Donne des exemples concrets
            - Propose 2-3 actions précises maximum
            - Sois amical mais pas trop formel`
          },
          ...context?.previousMessages?.map((msg: any) => ({
            role: msg.is_assistant ? 'assistant' : 'user',
            content: msg.content
          })) || [],
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenRouter API error:', error)
      throw new Error('Failed to get response from AI')
    }

    const data = await response.json()
    console.log('AI Response:', data)

    // Store interaction in database
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('ai_interactions').insert({
      user_id: userId,
      interaction_type: 'chat',
      context: message
    })

    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in chat-ai function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
