
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing chat request with HuggingFace, messages:', JSON.stringify(messages, null, 2));

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('HUGGING_FACE_ACCESS_TOKEN is not configured');
    }

    const hf = new HfInference(hfToken);

    // Formatage du prompt pour le modèle
    const conversationText = messages.map(msg => {
      if (msg.role === 'system') {
        return `Instructions: ${msg.content}\n`;
      } else if (msg.role === 'user') {
        return `User: ${msg.content}\n`;
      } else {
        return `Assistant: ${msg.content}\n`;
      }
    }).join('');

    console.log('Formatted conversation:', conversationText);

    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        inputs: conversationText + 'Assistant:',
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1
        }
      });

      console.log('HuggingFace response:', response);

      const generatedText = response.generated_text.trim();

      // Format the response to match the OpenAI format expected by the frontend
      const formattedResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: generatedText
            }
          }
        ]
      };

      return new Response(JSON.stringify(formattedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('HuggingFace API error:', aiError);
      throw new Error(`Erreur lors de la génération du contenu: ${aiError.message}`);
    }

  } catch (error) {
    console.error('Error in victaure-chat function:', error);
    return new Response(
      JSON.stringify({
        error: 'Une erreur est survenue lors du traitement de votre demande.',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
