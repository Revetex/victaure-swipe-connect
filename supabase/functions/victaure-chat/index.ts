
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

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
    const { messages, context, useWebSearch } = await req.json()

    console.log("Received request:", {
      messageCount: messages.length,
      firstMessage: messages[0],
      useWebSearch
    })

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: useWebSearch ? 0.3 : 0.7,
        topP: 0.8,
        topK: 40
      }
    })

    // Construct the conversation history
    const prompt = `${context}\n\nHistorique de la conversation:\n` + 
      messages.map(m => `${m.isUser ? 'Utilisateur' : 'Assistant'}: ${m.content}`).join('\n') +
      (useWebSearch ? "\nUtilise les informations du web pour répondre de manière précise et factuelle." : "");

    console.log("Sending prompt to Gemini:", prompt)

    // Generate response
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("Received response from Gemini:", text.substring(0, 100) + "...")

    return new Response(
      JSON.stringify({ 
        choices: [{ message: { content: text } }]
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error("Error in victaure-chat function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
