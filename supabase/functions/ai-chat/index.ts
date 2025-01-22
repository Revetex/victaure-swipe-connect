import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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
    const { message, userId, context } = await req.json()
    console.log('Received request:', { message, userId })
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'))
    
    // Format the conversation for the model
    const conversation = `
      System: ${context.systemPrompt}
      
      Previous messages:
      ${context.previousMessages?.map((msg: any) => 
        `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n') || ''}
      
      Human: ${message}
      Assistant: Je vous écoute attentivement. `

    console.log('Sending to Hugging Face:', conversation)

    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: conversation,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        do_sample: true,
        stop: ["Human:", "System:", "\n\n"]
      }
    })

    // Clean up the response by removing any system prompts or conversation formatting
    let cleanResponse = response.generated_text
      .replace(conversation, '') // Remove the input prompt
      .replace(/^Assistant:\s*/i, '') // Remove any "Assistant:" prefix
      .replace(/Human:.*$/s, '') // Remove any "Human:" suffix
      .replace(/System:.*$/s, '') // Remove any "System:" suffix
      .trim()

    console.log('Cleaned response:', cleanResponse)

    return new Response(
      JSON.stringify({ 
        response: cleanResponse,
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})