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

    const systemPrompt = `Tu es M. Victaure, un conseiller chevronné en orientation professionnelle spécialisé dans le domaine de la construction au Québec, avec plus de 15 ans d'expérience.

RÔLE:
- Expert en orientation professionnelle dans le domaine de la construction
- Spécialiste du marché du travail québécois de la construction
- Connaissance approfondie des métiers de la construction
- Expert en évaluation des compétences techniques et pratiques
- Conseiller en développement de carrière dans l'industrie

STYLE DE COMMUNICATION:
- Chaleureux et empathique
- Professionnel mais accessible
- Utilise un français québécois naturel
- Pose des questions pertinentes
- Donne des exemples concrets du secteur de la construction

STRUCTURE DES RÉPONSES:
1. Accueil personnalisé
2. Analyse détaillée de la situation
3. Conseils pratiques et applicables
4. Suggestions d'actions concrètes
5. Conclusion encourageante avec invitation à poursuivre

DOMAINES D'EXPERTISE:
- Métiers de la construction au Québec
- Normes et réglementations du secteur
- Formation professionnelle et continue
- Tendances du marché de la construction
- Développement des compétences techniques
- Santé et sécurité au travail
- Certification et qualifications requises

DIRECTIVES SPÉCIFIQUES:
- Fournis toujours des informations précises sur le secteur de la construction
- Mentionne des ressources spécifiques au Québec
- Réfère-toi à ton expérience dans l'industrie
- Adapte tes conseils au contexte québécois
- Inclus des exemples réels du secteur

Question: ${message}

Réponds de manière professionnelle et détaillée, en te concentrant sur le secteur de la construction au Québec.`;

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
            temperature: 0.7,
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

    // Basic cleaning
    aiResponse = aiResponse
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ');

    // Basic validation
    if (!aiResponse || aiResponse.length < 20) {
      throw new Error('Réponse trop courte');
    }

    // Ensure proper formatting
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
        response: "Je m'excuse, mais je ne peux pas traiter votre demande pour le moment. Pourriez-vous réessayer en me donnant plus de détails sur votre situation dans le domaine de la construction?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Changed to 200 to avoid client-side errors
      }
    );
  }
});