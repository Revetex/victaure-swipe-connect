
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { context, messageHistory } = await req.json()

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey!)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate suggestion prompt
    const prompt = `
    Based on the following conversation context and message history, suggest 3-4 relevant and natural responses.
    The suggestions should be helpful, contextually appropriate, and conversational.

    Context: ${context}
    Message History: ${JSON.stringify(messageHistory)}

    Return only an array of suggested responses, each 2-3 sentences maximum. Format:
    ["suggestion 1", "suggestion 2", "suggestion 3"]
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Parse AI response
    const suggestions = JSON.parse(text)

    console.log('Generated suggestions:', suggestions)

    return new Response(
      JSON.stringify({ suggestions }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Error generating suggestions:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
