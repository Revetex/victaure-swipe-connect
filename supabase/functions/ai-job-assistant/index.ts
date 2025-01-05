import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleJobSearch } from "./handlers/jobSearch.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Québec, spécialisé dans le domaine de la construction. 

Ton rôle est d'aider les utilisateurs à:
1. Trouver des offres d'emploi pertinentes dans la construction
2. Comprendre les exigences du marché québécois
3. Améliorer leur profil professionnel
4. Obtenir des conseils personnalisés sur leur carrière

Base de connaissances:
- Tu connais parfaitement le marché de la construction au Québec
- Tu comprends les différents métiers et leurs spécificités
- Tu es au fait des certifications et formations requises
- Tu maîtrises les normes et réglementations du secteur

Règles de communication:
- Tu communiques en français québécois de manière professionnelle
- Tu es précis et concret dans tes recommandations
- Tu poses des questions pour mieux comprendre les besoins
- Tu suggères toujours des actions concrètes`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Received message:', message);
    console.log('Context:', context);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier si le message concerne la recherche d'emploi
    const jobKeywords = [
      'emploi', 'job', 'travail', 'offre', 'poste', 
      'recherche', 'construction', 'chantier', 'métier'
    ];
    const isJobSearch = jobKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    let response;
    if (isJobSearch) {
      console.log('Handling job search request');
      response = await handleJobSearch(message, context?.userProfile, supabase);
    } else {
      // Réponse générale avec suggestions d'actions
      response = {
        message: "Je peux vous aider à trouver un emploi dans la construction ou à améliorer votre profil professionnel. Que souhaitez-vous faire?",
        suggestedActions: [
          {
            type: 'navigate_to_jobs',
            label: 'Voir les offres disponibles',
            icon: 'briefcase'
          },
          {
            type: 'navigate_to_profile',
            label: 'Améliorer mon profil',
            icon: 'user'
          }
        ]
      };
    }

    // Log the response for debugging
    console.log('AI Response:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-job-assistant:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Je m'excuse, j'ai rencontré une erreur. Pouvez-vous reformuler votre demande?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});