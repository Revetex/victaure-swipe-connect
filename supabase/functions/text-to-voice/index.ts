
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'You are a text-to-speech API. Convert the given text to natural spoken language, focusing on proper pronunciation, intonation, and emotional context.'
          },
          {
            role: 'user',
            content: `Convert this text to speech with natural intonation and emotion: "${text}"`
          }
        ],
        stream: false
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    const data = await response.json()
    const generatedText = data.choices[0].message.content

    console.log('Generated response:', generatedText)

    return new Response(
      JSON.stringify({ text: generatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
