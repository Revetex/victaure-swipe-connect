import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
          inputs: `Tu es M. Victaure, un conseiller en orientation professionnelle expérimenté au Québec. Réponds de manière concise et professionnelle à la question suivante: ${message}`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse brute:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    // Clean up the response
    let aiResponse = data[0].generated_text
      .replace(/^[^:]*:/, '') // Remove any prefix before first colon
      .trim();

    console.log('Réponse nettoyée:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});