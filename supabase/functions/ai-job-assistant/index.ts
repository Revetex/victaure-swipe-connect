import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, action } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing request:', { action, userId });

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error('Error fetching user profile');
    }

    switch (action) {
      case 'search_jobs':
        // Search for jobs based on user profile and preferences
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        // Search external job boards
        const externalJobs = await searchExternalJobs(profile.skills);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Voici les offres d'emploi qui correspondent à votre profil",
            jobs: [...jobs, ...externalJobs]
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'analyze_profile':
        // Analyze user profile and provide recommendations
        const analysis = await analyzeUserProfile(profile);
        
        return new Response(
          JSON.stringify({
            success: true,
            analysis
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Action non reconnue');
    }
  } catch (error) {
    console.error('Error in ai-job-assistant:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function searchExternalJobs(skills: string[]) {
  try {
    // Search Indeed
    const indeedJobs = await searchIndeed(skills);
    
    // Search LinkedIn
    const linkedinJobs = await searchLinkedIn(skills);

    return [...indeedJobs, ...linkedinJobs];
  } catch (error) {
    console.error('Error searching external jobs:', error);
    return [];
  }
}

async function searchIndeed(skills: string[]) {
  // Implementation of Indeed job search
  return [];
}

async function searchLinkedIn(skills: string[]) {
  // Implementation of LinkedIn job search
  return [];
}

async function analyzeUserProfile(profile: any) {
  const recommendations = {
    skills: [] as string[],
    certifications: [] as string[],
    jobTypes: [] as string[],
    suggestions: [] as string[]
  };

  // Analyze skills
  if (profile.skills?.length < 5) {
    recommendations.suggestions.push("Ajoutez plus de compétences à votre profil pour augmenter vos chances de match");
  }

  // Analyze experience
  if (!profile.experiences?.length) {
    recommendations.suggestions.push("Ajoutez vos expériences professionnelles pour mettre en valeur votre parcours");
  }

  return recommendations;
}