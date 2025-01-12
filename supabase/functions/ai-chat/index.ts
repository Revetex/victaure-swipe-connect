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
    console.log('Question reçue:', message);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Clé API manquante');
    }

    const systemPrompt = `Tu es M. Victaure, un assistant virtuel professionnel. 

Instructions strictes:
- Réponds uniquement de manière directe et contextuelle
- Ne donne JAMAIS d'exemples dans tes réponses
- N'utilise PAS de formatage ou de listes
- Si la question est ambiguë, demande une précision simple
- Utilise un français québécois naturel
- Limite ta réponse à 1-2 phrases maximum

Question de l'utilisateur: ${message}`;

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
            max_new_tokens: 100,
            temperature: 0.5,
            top_p: 0.8,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data[0]?.generated_text
      ?.split('Assistant:').pop()
      ?.split('Human:')[0]
      ?.trim();

    if (!aiResponse) {
      aiResponse = "Comment puis-je vous aider aujourd'hui?";
    }

    // Nettoyer la réponse et enlever tout formatage
    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/([0-9]+\.|•|-)\s/g, '')
      .replace(/(exemple|par exemple|voici|comme suit)/gi, '');

    console.log('Réponse envoyée:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ 
        response: "Pouvez-vous reformuler votre demande?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});