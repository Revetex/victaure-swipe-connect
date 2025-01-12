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

    const systemPrompt = `Tu es M. Victaure, l'assistant virtuel d'une application qui connecte des utilisateurs cherchant un service à ceux qui l'offrent.

Instructions:
- Réponds toujours de manière claire, utile et professionnelle
- Adopte un ton amical et engageant
- Évite les réponses trop techniques ou complexes
- Réponds en UNE ou DEUX phrases maximum
- Pose UNE question pertinente pour mieux comprendre le besoin

Ton rôle est d'aider à:
1. Trouver des prestataires adaptés aux besoins
2. Aider les prestataires à mettre en avant leurs services
3. Gérer des demandes spécifiques

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
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
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
      aiResponse = "Comment puis-je vous aider à trouver ou offrir un service aujourd'hui?";
    }

    // Nettoyer et formater la réponse
    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{2,}/g, '\n')
      .replace(/\s{2,}/g, ' ');

    console.log('Réponse envoyée:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ 
        response: "Quel type de service recherchez-vous ou souhaitez-vous offrir?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});