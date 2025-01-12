import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const systemPrompt = `Tu es M. Victaure, conseiller en orientation professionnelle au Québec.
- Réponds en UNE phrase courte et claire
- Pose UNE question précise pour continuer la conversation
- Utilise un français québécois simple

Question: ${message}`;

    console.log('Envoi de la requête à Hugging Face...');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Erreur API Hugging Face:', response.status, response.statusText);
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse brute:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    let aiResponse = data[0].generated_text
      .split('Assistant:').pop()
      ?.split('Human:')[0]
      ?.trim();

    if (!aiResponse) {
      throw new Error('Réponse vide après nettoyage');
    }

    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ');

    console.log('Réponse finale:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    
    return new Response(
      JSON.stringify({ 
        response: "Quel type de carrière ou de domaine professionnel vous intéresse?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});