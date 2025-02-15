
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller professionnel chaleureux et polyvalent au Québec. Tu dois:

OBJECTIFS PRINCIPAUX:
- Être proactif dans la découverte des besoins et aspirations de l'utilisateur
- Poser des questions pertinentes pour enrichir le profil professionnel
- Offrir des conseils personnalisés basés sur le contexte
- Guider vers des opportunités d'emploi adaptées
- Suggérer des formations et certifications pertinentes

RÈGLES DE CONVERSATION:
- Maintenir un ton chaleureux et professionnel
- Poser une nouvelle question après chaque réponse de l'utilisateur
- Adapter ton langage selon le niveau de l'interlocuteur
- Utiliser le contexte des conversations précédentes
- Proposer des suggestions concrètes et réalistes

DOMAINES D'EXPERTISE:
- Construction et métiers connexes au Québec
- Tendances du marché du travail
- Formations et certifications professionnelles
- Développement de carrière
- Négociation salariale

COMPORTEMENTS CLÉS:
- Toujours chercher à approfondir ta compréhension du profil
- Identifier les opportunités d'amélioration
- Suggérer des parcours de progression professionnelle
- Alerter sur les tendances du marché pertinentes
- Encourager le développement des compétences

Tu dois analyser chaque réponse pour:
1. Extraire les informations importantes sur le profil
2. Identifier les besoins non exprimés
3. Proposer des suggestions pertinentes
4. Poser une question de suivi stratégique`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));
    
    // Enrichir le prompt avec le contexte
    const userProfile = context?.userProfile || {};
    const previousMessages = context?.recentMessages || [];
    
    // Analyser le contexte pour des suggestions personnalisées
    const proactiveQuestions = context?.proactiveQuestions || [];
    const learningPrompts = context?.learningPrompts || {};
    
    // Construire un prompt contextuel
    const contextualPrompt = `${SYSTEM_PROMPT}

Profil actuel de l'utilisateur:
${JSON.stringify(userProfile, null, 2)}

Historique récent de la conversation:
${previousMessages.map(m => `${m.is_assistant ? 'M. Victaure' : 'Utilisateur'}: ${m.content}`).join('\n')}

Questions proactives disponibles:
${proactiveQuestions.join('\n')}

Message actuel: ${message}

M. Victaure:`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: contextualPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    });

    // Extraire les informations pertinentes de la réponse
    const aiResponse = response.generated_text;
    
    // Analyser la réponse pour détecter les nouvelles informations
    const learnedInfo = analyzeResponseForNewInfo(aiResponse, userProfile);

    console.log('Generated response:', aiResponse);
    console.log('Learned info:', learnedInfo);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        learnedInfo: learnedInfo 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI career chat:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Fonction pour analyser la réponse et extraire les nouvelles informations
function analyzeResponseForNewInfo(response: string, currentProfile: any) {
  const newInfo: Record<string, any> = {};
  
  // Détecter les compétences
  const skillsMatch = response.match(/compétences?[:\s]+([\w\s,]+)/i);
  if (skillsMatch && skillsMatch[1]) {
    const skills = skillsMatch[1].split(',').map(s => s.trim());
    if (!currentProfile.skills?.includes(...skills)) {
      newInfo.skills = [...(currentProfile.skills || []), ...skills];
    }
  }

  // Détecter les objectifs de carrière
  const objectivesMatch = response.match(/objectifs?[:\s]+([\w\s,]+)/i);
  if (objectivesMatch && objectivesMatch[1]) {
    newInfo.career_objectives = objectivesMatch[1].trim();
  }

  // Détecter les préférences de localisation
  const locationMatch = response.match(/région[:\s]+([\w\s,]+)/i);
  if (locationMatch && locationMatch[1]) {
    newInfo.preferred_locations = locationMatch[1].trim();
  }

  // Détecter les attentes salariales
  const salaryMatch = response.match(/salaire[:\s]+(\d+)/i);
  if (salaryMatch && salaryMatch[1]) {
    newInfo.salary_expectations = parseInt(salaryMatch[1]);
  }

  return Object.keys(newInfo).length > 0 ? newInfo : null;
}
