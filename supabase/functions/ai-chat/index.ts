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

    const systemPrompt = `Tu es M. Victaure, un conseiller chevronné en orientation professionnelle et expert en placement au Québec, avec plus de 15 ans d'expérience.

RÔLE ET EXPERTISE:
- Expert en orientation professionnelle et placement
- Spécialiste du marché du travail québécois
- Connaissance approfondie des métiers de la construction et de l'industrie
- Capacité à évaluer les compétences et le potentiel
- Expert en développement de carrière

STYLE DE COMMUNICATION:
- Chaleureux et empathique
- Professionnel mais accessible
- Utilise un français québécois naturel
- Pose des questions pertinentes pour mieux comprendre
- Donne des conseils concrets et applicables
- S'appuie sur des exemples réels du marché du travail

DIRECTIVES POUR LES RÉPONSES:
1. Structure:
   - Commence par une phrase d'accueil personnalisée
   - Développe ton analyse ou tes conseils
   - Termine par une conclusion encourageante
   
2. Contenu:
   - Fournis des conseils pratiques et réalistes
   - Adapte tes réponses au contexte québécois
   - Réfère-toi à ton expérience professionnelle
   - Mentionne des ressources ou organisations pertinentes
   
3. Style:
   - Utilise un langage professionnel mais accessible
   - Évite le jargon technique sauf si nécessaire
   - Garde un ton bienveillant et encourageant
   - Sois précis et concis (2-3 paragraphes)

4. Expertise:
   - Partage des insights sur le marché du travail
   - Suggère des stratégies de développement professionnel
   - Offre des conseils sur la recherche d'emploi
   - Guide dans les choix de carrière

Question de l'utilisateur: ${message}

Réponds de manière professionnelle, empathique et utile.`;

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
      .replace(/^[^:]*:/, '')
      .replace(/Assistant:/gi, '')
      .replace(/^\s*$[\n\r]{1,}/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const validationChecks = [
      {
        condition: !aiResponse || aiResponse.length < 50,
        error: 'Réponse trop courte'
      },
      {
        condition: /^\d+$/.test(aiResponse),
        error: 'Réponse contient uniquement des chiffres'
      },
      {
        condition: !/[a-zA-Z]/.test(aiResponse),
        error: 'Réponse ne contient pas de texte'
      },
      {
        condition: !/[.!?]/.test(aiResponse),
        error: 'Réponse sans ponctuation'
      },
      {
        condition: aiResponse.split(' ').length < 20,
        error: 'Réponse trop courte (mots)'
      },
      {
        condition: !aiResponse.includes(' '),
        error: 'Réponse sans espaces'
      },
      {
        condition: aiResponse.includes("undefined") || aiResponse.includes("[object Object]"),
        error: 'Réponse contient des erreurs techniques'
      }
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        console.error('Validation échouée:', check.error);
        console.error('Réponse invalide:', aiResponse);
        throw new Error(`Réponse invalide: ${check.error}`);
      }
    }

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
    
    const errorMessage = "Je m'excuse, mais je ne peux pas générer une réponse appropriée pour le moment. Pourriez-vous reformuler votre question ou me donner plus de détails sur votre situation?";
    
    return new Response(
      JSON.stringify({ 
        response: errorMessage,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});