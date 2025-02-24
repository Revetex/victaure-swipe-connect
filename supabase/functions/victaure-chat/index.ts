
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, context, webSearch } = await req.json()

    console.log("Received request body:", {
      messageCount: messages.length,
      firstMessage: messages[0],
      context,
      webSearch
    })

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    let prompt = `${context}\n\nHistorique de la conversation:\n`
    messages.forEach((msg: any) => {
      prompt += `${msg.isUser ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n`
    })

    if (webSearch) {
      prompt += "\nUtilise les informations du web pour répondre de manière précise et factuelle."
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({ response: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in victaure-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
