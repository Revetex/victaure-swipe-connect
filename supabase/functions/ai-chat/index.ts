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
    
    // Format the conversation with previous messages if available
    let conversationHistory = '';
    if (context?.previousMessages) {
      conversationHistory = context.previousMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }
    
    // Format the conversation for the model
    const conversation = `<|system|>Tu es M. Victaure, un assistant professionnel spécialisé dans l'orientation professionnelle au Québec. Tu dois adapter tes réponses en fonction du contexte de la conversation et éviter de répéter les mêmes phrases. Sois naturel et empathique.

Historique de la conversation:
${conversationHistory}

<|user|>${message}</s>
<|assistant|>`;

    console.log('Sending to Hugging Face:', conversation);

    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: conversation,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.9,
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true,
        stop: ["</s>", "<|user|>", "<|system|>"]
      }
    });

    console.log('Raw response:', response);

    // Clean up the response
    let cleanResponse = response.generated_text
      .replace(conversation, '')
      .replace(/<\|assistant\|>/g, '')
      .replace(/<\|user\|>.*$/s, '')
      .replace(/<\|system\|>.*$/s, '')
      .replace(/<\/s>/g, '')
      .trim();

    // Fallback response if empty or same as previous
    if (!cleanResponse || (context?.previousMessages?.length > 0 && 
        context.previousMessages[context.previousMessages.length - 1]?.content === cleanResponse)) {
      cleanResponse = "Je m'excuse, mais je ne suis pas sûr de comprendre. Pourriez-vous reformuler votre question ou me donner plus de détails sur ce que vous cherchez ?";
    }

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