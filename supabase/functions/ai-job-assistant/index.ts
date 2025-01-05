import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleJobSearch } from "./handlers/jobSearch.ts";
import { handleCareerAdvice } from "./handlers/careerAdvice.ts";
import { handleProfileAnalysis } from "./handlers/profileAnalysis.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing request:', { context });

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error('Error fetching user profile');
    }

    // Analyze message intent
    const messageIntent = analyzeMessageIntent(message.toLowerCase());
    let response;

    switch (messageIntent) {
      case 'job_search':
        response = await handleJobSearch(message, profile, supabase);
        break;
      case 'career_advice':
        response = await handleCareerAdvice(message, profile);
        break;
      case 'profile_analysis':
        response = await handleProfileAnalysis(profile, supabase);
        break;
      default:
        response = {
          message: "Je suis là pour vous aider dans votre recherche d'emploi. Comment puis-je vous aider aujourd'hui ?",
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
        error: error.message,
        message: "Je suis désolé, une erreur est survenue. Pouvez-vous reformuler votre demande ?"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function analyzeMessageIntent(message: string): string {
  const jobSearchKeywords = ['emploi', 'job', 'travail', 'offre', 'poste', 'recherche'];
  const careerAdviceKeywords = ['conseil', 'carrière', 'orientation', 'formation', 'étude'];
  const profileKeywords = ['profil', 'cv', 'compétence', 'expérience'];

  if (jobSearchKeywords.some(keyword => message.includes(keyword))) {
    return 'job_search';
  }
  if (careerAdviceKeywords.some(keyword => message.includes(keyword))) {
    return 'career_advice';
  }
  if (profileKeywords.some(keyword => message.includes(keyword))) {
    return 'profile_analysis';
  }
  return 'general';
}