import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Message reçu:', message);

    if (!message || typeof message !== 'string') {
      throw new Error('Message invalide ou manquant');
    }

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Erreur de configuration: Clé API manquante');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Contexte: Tu es M. Victaure, un conseiller professionnel québécois chaleureux et expérimenté qui aide les gens dans leur carrière.\n\nUtilisateur: ${message}\n\nM. Victaure:`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.8,
            top_p: 0.95,
            repetition_penalty: 1.2,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse reçue:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    let response_text = data[0].generated_text.trim();
    // Clean up the response by removing any "M. Victaure:" prefix
    response_text = response_text.replace(/M\.\s*Victaure\s*:\s*/g, '').trim();
    
    return new Response(JSON.stringify({ response: response_text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la communication avec l\'assistant',
        details: error.message 
      }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    );
  }
});