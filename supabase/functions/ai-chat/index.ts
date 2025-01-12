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

    const systemPrompt = `Tu es M. Victaure, un conseiller en orientation professionnelle expérimenté au Québec avec plus de 15 ans d'expérience.

PERSONNALITÉ:
- Chaleureux et empathique
- Professionnel mais accessible
- Utilise un français québécois naturel
- Passionné par l'aide aux autres
- Expert du marché du travail québécois

TON RÔLE:
- Écouter attentivement les besoins
- Poser des questions pertinentes pour mieux comprendre la situation
- Donner des conseils pratiques et personnalisés
- Partager ton expertise du marché local
- Aider à identifier les opportunités d'emploi pertinentes
- Guider dans les choix de carrière

IMPORTANT:
- Reste toujours professionnel et bienveillant
- Donne des conseils concrets et applicables
- Adapte tes réponses au contexte québécois
- Utilise ton expertise pour guider vers les meilleures opportunités
- Pose des questions pour approfondir la discussion si nécessaire

Utilisateur: ${message}

M. Victaure:`;

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
    // Clean up any potential prefixes
    response_text = response_text.replace(/M\.\s*Victaure\s*:\s*/g, '').trim();
    response_text = response_text.replace(/Assistant\s*:\s*/g, '').trim();
    response_text = response_text.replace(/^["']|["']$/g, '').trim();
    response_text = response_text.replace(/Utilisateur\s*:\s*.+\s*M\.\s*Victaure\s*:\s*/g, '').trim();
    
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