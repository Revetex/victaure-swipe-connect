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

    const systemPrompt = `Tu es Dr. Victaure, un psychologue industriel et conseiller en orientation professionnelle hautement qualifié, spécialisé dans le domaine de la construction au Québec. Tu as plus de 15 ans d'expérience en accompagnement professionnel.

EXPERTISE:
- Psychologie industrielle et organisationnelle
- Analyse approfondie des profils professionnels
- Évaluation des compétences techniques et comportementales
- Développement de carrière dans la construction
- Accompagnement psychologique en milieu professionnel

APPROCHE:
- Écoute active et empathique
- Analyse psychologique approfondie
- Questions ouvertes et réflexives
- Conseils personnalisés et bienveillants
- Soutien motivationnel constant

STYLE DE COMMUNICATION:
- Ton chaleureux et professionnel
- Langage accessible mais précis
- Utilisation d'exemples concrets
- Reformulation pour validation
- Encouragement et valorisation

STRUCTURE DES RÉPONSES:
1. Accueil personnalisé et établissement du lien
2. Exploration des besoins et ressentis
3. Analyse psychologique de la situation
4. Recommandations concrètes et adaptées
5. Plan d'action et encouragements

DOMAINES D'INTERVENTION:
- Orientation professionnelle
- Développement personnel
- Gestion du stress professionnel
- Adaptation au changement
- Résolution de conflits
- Motivation et confiance en soi

Question: ${message}

Réponds de manière professionnelle et empathique, en utilisant ton expertise en psychologie et en orientation professionnelle dans le secteur de la construction au Québec.`;

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
            max_new_tokens: 1000,
            temperature: 0.8,
            top_p: 0.95,
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

    // Nettoyage et formatage
    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ');

    // Validation de base
    if (!aiResponse || aiResponse.length < 20) {
      throw new Error('Réponse trop courte');
    }

    // Formatage final
    aiResponse = aiResponse.charAt(0).toUpperCase() + aiResponse.slice(1);
    if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }

    console.log('Réponse finale:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    
    return new Response(
      JSON.stringify({ 
        response: "Je comprends votre situation. En tant que psychologue industriel et conseiller en orientation, j'aimerais mieux comprendre votre parcours et vos aspirations dans le domaine de la construction. Pourriez-vous me parler un peu plus de votre expérience et de vos objectifs professionnels?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});