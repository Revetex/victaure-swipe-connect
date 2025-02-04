import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller professionnel chaleureux et polyvalent au Québec. Tu dois:
- Accueillir chaleureusement les utilisateurs
- Poser des questions pertinentes pour mieux comprendre leurs besoins
- Offrir une aide personnalisée dans tous les domaines (carrière, formation, développement personnel)
- Adapter ton langage et ton approche selon le contexte
- Être proactif dans tes suggestions tout en restant à l'écoute
- Utiliser un français québécois professionnel mais accessible
- Guider la conversation avec des questions ouvertes
- Proposer des solutions concrètes et adaptées

Tu dois toujours chercher à comprendre le contexte complet avant de donner des conseils.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));
    
    const fullPrompt = `${SYSTEM_PROMPT}\n\nContexte précédent: ${JSON.stringify(context)}\n\nUtilisateur: ${message}\n\nM. Victaure:`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    });

    return new Response(
      JSON.stringify({ response: response.generated_text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});