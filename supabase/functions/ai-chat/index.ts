import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Received request:', { message, userId });
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));
    
    // Format the conversation for the model
    const conversation = `<|system|>Tu es M. Victaure, un assistant professionnel spécialisé dans l'orientation professionnelle. Tu es là pour aider les utilisateurs dans leur recherche d'emploi et leur développement de carrière. Sois toujours professionnel, précis et bienveillant.</s>
<|user|>${message}</s>
<|assistant|>`;

    console.log('Sending to Hugging Face:', conversation);

    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: conversation,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        do_sample: true,
        stop: ["</s>", "<|user|>", "<|system|>"]
      }
    });

    console.log('Raw response:', response);

    // Clean up the response
    const cleanResponse = response.generated_text
      .replace(conversation, '')
      .replace(/<\|assistant\|>/g, '')
      .replace(/<\|user\|>.*$/s, '')
      .replace(/<\|system\|>.*$/s, '')
      .replace(/<\/s>/g, '')
      .trim();

    console.log('Cleaned response:', cleanResponse);

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
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});