
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserContext {
  previousMessages: any[];
  userProfile: any;
}

interface AIResponse {
  response: string;
  suggestedJobs?: any[];
}

async function analyzeUserProfile(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    skills: profile?.skills || [],
    location: profile?.city,
    role: profile?.role,
    experience: profile?.experiences || []
  };
}

async function findRelevantJobs(supabase: any, userProfile: any) {
  let query = supabase
    .from('scraped_jobs')
    .select('*')
    .order('posted_at', { ascending: false });

  // Filtrer par localisation
  if (userProfile.location) {
    query = query.ilike('location', `%${userProfile.location}%`);
  }

  const { data: jobs } = await query.limit(5);
  return jobs || [];
}

function generatePersonalizedResponse(userProfile: any, jobs: any[], messageContext: string) {
  // Vérifier si l'utilisateur demande des emplois
  const jobKeywords = ['emploi', 'job', 'poste', 'travail', 'offre'];
  const isJobQuery = jobKeywords.some(kw => messageContext.toLowerCase().includes(kw));

  let response = '';
  
  if (isJobQuery && jobs.length > 0) {
    response = `D'après votre profil et votre expérience en tant que ${userProfile.role}, voici les offres qui correspondent le mieux à vos compétences :\n\n`;
    
    jobs.forEach((job, index) => {
      response += `${index + 1}. ${job.title}\n`;
      response += `🏢 ${job.company}\n`;
      if (userProfile.location === job.location) {
        response += `📍 ${job.location} (dans votre ville)\n`;
      } else {
        response += `📍 ${job.location}\n`;
      }
      
      const matchingSkills = userProfile.skills.filter((skill: string) => 
        job.description?.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (matchingSkills.length > 0) {
        response += `✨ Compétences correspondantes : ${matchingSkills.join(', ')}\n`;
      }
      
      response += `🔗 ${job.url}\n\n`;
    });
    
    // Suggestion personnalisée
    response += `Ces offres correspondent particulièrement bien à votre expérience ${userProfile.experience?.[0]?.position || ''} et à vos compétences en ${userProfile.skills.slice(0, 3).join(', ')}. Souhaitez-vous que je vous aide à préparer votre candidature pour l'un de ces postes ?`;
  } else {
    // Conversation générale
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Bonjour' : timeOfDay < 18 ? 'Bon après-midi' : 'Bonsoir';
    
    response = `${greeting} ! Je suis là pour vous aider dans votre recherche d'emploi. Je vois que vous avez de l'expérience en ${userProfile.role}. Voulez-vous que je recherche des opportunités qui correspondent à votre profil, ou puis-je vous aider d'une autre manière ?`;
  }

  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Received request:', { userId, messageContext: message });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Analyser le profil de l'utilisateur
    const userProfile = await analyzeUserProfile(supabase, userId);
    console.log('User profile:', userProfile);

    // Trouver des emplois pertinents
    const relevantJobs = await findRelevantJobs(supabase, userProfile);
    console.log('Found relevant jobs:', relevantJobs.length);

    // Générer une réponse personnalisée
    const response = generatePersonalizedResponse(userProfile, relevantJobs, message);

    // Sauvegarder l'interaction
    await supabase.from('ai_chat_messages').insert([
      {
        user_id: userId,
        content: message,
        sender: 'user'
      },
      {
        user_id: userId,
        content: response,
        sender: 'assistant'
      }
    ]);

    return new Response(
      JSON.stringify({ response, suggestedJobs: relevantJobs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
