import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleJobSearch } from "./handlers/jobSearch.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received message:', message);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifie si le message contient des mots-clés liés à la recherche d'emploi
    const jobKeywords = ['emploi', 'job', 'travail', 'offre', 'poste'];
    const isJobSearch = jobKeywords.some(keyword => message.toLowerCase().includes(keyword));

    let response;
    if (isJobSearch) {
      console.log('Handling job search request');
      response = await handleJobSearch(message, null, supabase);
    } else {
      response = {
        message: "Comment puis-je vous aider avec votre recherche d'emploi ?",
        suggestedActions: [
          {
            type: 'navigate_to_jobs',
            label: 'Voir les offres',
            icon: 'briefcase'
          }
        ]
      };
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-job-assistant:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Désolé, je n'ai pas compris. Pouvez-vous reformuler votre question ?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});