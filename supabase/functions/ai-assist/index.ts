import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/QwQ-32B-Preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Québec. 
                Sois concis et direct dans tes réponses.
                
                User: ${prompt}
                
                Assistant:`,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API Error:', error);
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    console.log('AI response:', data);

    const generatedText = data[0].generated_text.split('Assistant:').pop()?.trim();

    return new Response(
      JSON.stringify({ content: generatedText || "Je m'excuse, je n'ai pas bien compris. Pouvez-vous reformuler?" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-assist function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de la génération du contenu",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});