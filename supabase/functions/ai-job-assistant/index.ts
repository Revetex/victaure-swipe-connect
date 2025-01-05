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

    let response;
    switch (context.currentAction) {
      case 'search_jobs':
        // Search for jobs based on user profile and preferences
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;

        // Search external job boards
        const externalJobs = await searchExternalJobs(context.userProfile.skills);

        // Analyze jobs relevance based on user profile
        const relevantJobs = analyzeJobsRelevance([...jobs, ...externalJobs], context.userProfile);

        response = {
          message: "Voici les offres d'emploi qui correspondent le mieux à votre profil",
          jobs: relevantJobs.slice(0, 5),
          suggestedActions: [
            {
              type: 'navigate_to_jobs',
              label: 'Voir toutes les offres',
              icon: 'briefcase'
            }
          ]
        };
        break;

      case 'analyze_profile':
        // Analyze user profile and provide recommendations
        const analysis = await analyzeUserProfile(profile);
        
        response = {
          message: "Voici l'analyse de votre profil professionnel",
          analysis,
          suggestedActions: [
            {
              type: 'navigate_to_profile',
              label: 'Mettre à jour mon profil',
              icon: 'user'
            }
          ]
        };
        break;

      case 'career_advice':
        const advice = generateCareerAdvice(context);
        response = {
          message: advice.message,
          suggestedActions: advice.actions
        };
        break;

      case 'create_job':
        response = {
          message: "Je peux vous aider à créer une nouvelle offre d'emploi",
          suggestedActions: [
            {
              type: 'create_job',
              label: 'Créer une offre',
              icon: 'briefcase'
            }
          ]
        };
        break;

      default:
        response = await handleGeneralAssistance(message, context);
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

function analyzeJobsRelevance(jobs: any[], userProfile: any) {
  return jobs.map(job => {
    const score = calculateJobMatchScore(job, userProfile);
    return { ...job, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

function calculateJobMatchScore(job: any, profile: any) {
  let score = 0;
  
  // Match skills
  const userSkills = new Set(profile.skills || []);
  const jobRequiredSkills = new Set(job.required_skills || []);
  const jobPreferredSkills = new Set(job.preferred_skills || []);
  
  // Calculate skill match percentage
  const requiredSkillsMatch = [...jobRequiredSkills].filter(skill => userSkills.has(skill)).length;
  const preferredSkillsMatch = [...jobPreferredSkills].filter(skill => userSkills.has(skill)).length;
  
  score += (requiredSkillsMatch / Math.max(1, jobRequiredSkills.size)) * 60;
  score += (preferredSkillsMatch / Math.max(1, jobPreferredSkills.size)) * 40;
  
  return Math.min(100, score);
}

async function analyzeUserProfile(profile: any) {
  const recommendations = {
    skills: [] as string[],
    certifications: [] as string[],
    jobTypes: [] as string[],
    suggestions: [] as string[]
  };

  // Analyze skills
  if (!profile.skills?.length) {
    recommendations.suggestions.push("Ajoutez vos compétences pour augmenter vos chances de match");
  } else if (profile.skills.length < 5) {
    recommendations.suggestions.push("Enrichissez votre profil avec plus de compétences");
  }

  // Analyze experience
  if (!profile.experiences?.length) {
    recommendations.suggestions.push("Ajoutez vos expériences professionnelles");
  }

  // Get trending skills in the industry
  const { data: trendingSkills } = await supabase
    .from('jobs')
    .select('required_skills')
    .not('required_skills', 'is', null);

  const skillFrequency = new Map();
  trendingSkills?.forEach((job: any) => {
    job.required_skills?.forEach((skill: string) => {
      skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
    });
  });

  // Recommend top skills not in user's profile
  const userSkills = new Set(profile.skills || []);
  const topSkills = Array.from(skillFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill)
    .filter(skill => !userSkills.has(skill));

  recommendations.skills = topSkills;

  return recommendations;
}

function generateCareerAdvice(context: any) {
  const advice = {
    message: "",
    actions: [] as any[]
  };

  if (context.userProfile.role === 'professional') {
    advice.message = "Voici quelques conseils pour optimiser votre recherche d'emploi";
    advice.actions = [
      {
        type: 'navigate_to_profile',
        label: 'Optimiser mon profil',
        icon: 'user'
      },
      {
        type: 'navigate_to_jobs',
        label: 'Explorer les offres',
        icon: 'briefcase'
      }
    ];
  } else {
    advice.message = "Voici quelques conseils pour attirer les meilleurs talents";
    advice.actions = [
      {
        type: 'create_job',
        label: 'Publier une offre',
        icon: 'briefcase'
      }
    ];
  }

  return advice;
}

async function handleGeneralAssistance(message: string, context: any) {
  // Analyze message intent and provide appropriate response
  const response = {
    message: "Je suis là pour vous aider dans votre recherche d'emploi. Que souhaitez-vous faire ?",
    suggestedActions: [
      {
        type: 'navigate_to_jobs',
        label: 'Chercher des offres',
        icon: 'briefcase'
      },
      {
        type: 'navigate_to_profile',
        label: 'Voir mon profil',
        icon: 'user'
      }
    ]
  };

  return response;
}