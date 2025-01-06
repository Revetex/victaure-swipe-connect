import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleJobSearch } from "./handlers/jobSearch.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Québec, spécialisé dans le domaine de la construction. Sois concis et direct dans tes réponses.`;

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

    // Fetch complete user profile with related data
    let userProfile = context?.userProfile;
    if (!userProfile && userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          experiences (
            company,
            position,
            start_date,
            end_date,
            description
          ),
          education (
            school_name,
            degree,
            field_of_study
          ),
          certifications (
            title,
            issuer,
            issue_date
          )
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        userProfile = profile;
      }
    }

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
      response = await handleJobSearch(message, userProfile, supabase);
    } else {
      const response = await fetch('https://api.huggingface.co/models/Qwen/QwQ-32B-Preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 256,  // Reduced from 1024
            temperature: 0.5,     // Reduced from 0.7
            top_p: 0.9,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            return_full_text: false
          }
        }),
      });

      const data = await response.json();
      const assistantResponse = data[0].generated_text.split('Assistant:').pop()?.trim();

      response = {
        message: assistantResponse || "Je m'excuse, je n'ai pas bien compris. Pouvez-vous reformuler?",
        suggestedActions: userProfile?.role === 'professional' ? [
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
        ] : [
          {
            type: 'create_job',
            label: 'Publier une offre',
            icon: 'plus-circle'
          },
          {
            type: 'navigate_to_jobs',
            label: 'Gérer mes offres',
            icon: 'list'
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
        message: "Je m'excuse, j'ai rencontré une erreur. Pouvez-vous reformuler votre demande?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});