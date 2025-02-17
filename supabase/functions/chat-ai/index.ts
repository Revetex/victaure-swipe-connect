
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatContext {
  recentMessages: string[];
  userQuery: string;
  userProfile: any;
}

// Intelligence conversationnelle
class ConversationManager {
  private context: ChatContext;
  private messageHistory: string[] = [];
  private lastJobQuery: string | null = null;

  constructor(context: ChatContext) {
    this.context = context;
  }

  addToHistory(message: string) {
    this.messageHistory.push(message);
    if (this.messageHistory.length > 10) {
      this.messageHistory.shift();
    }
  }

  isRepetitiveQuery(query: string): boolean {
    return this.lastJobQuery === query;
  }

  shouldRefreshJobs(): boolean {
    return !this.lastJobQuery || 
           this.messageHistory.length > 5 || 
           this.context.userQuery.toLowerCase().includes('nouveau') ||
           this.context.userQuery.toLowerCase().includes('récent');
  }

  analyzeIntent(query: string): string {
    const jobKeywords = ['emploi', 'job', 'poste', 'travail', 'offre'];
    const helpKeywords = ['aide', 'assister', 'conseils', 'comment'];
    const query_lower = query.toLowerCase();

    if (jobKeywords.some(kw => query_lower.includes(kw))) {
      return 'recherche_emploi';
    }
    if (helpKeywords.some(kw => query_lower.includes(kw))) {
      return 'aide';
    }
    return 'conversation';
  }
}

async function findRelevantJobs(supabase: any, userProfile: any) {
  const { skills = [], city, experience = [] } = userProfile;

  // Construire une requête complexe pour trouver des emplois pertinents
  let query = supabase
    .from('scraped_jobs')
    .select('*')
    .order('posted_at', { ascending: false });

  // Filtre géographique
  if (city) {
    query = query.or(`location.ilike.%${city}%,location.ilike.%${city.split(',')[0]}%`);
  }

  // Filtre par compétences
  if (skills.length > 0) {
    const skillsFilter = skills.map((skill: string) => 
      `description.ilike.%${skill}%`
    ).join(',');
    query = query.or(skillsFilter);
  }

  // Filtre par expérience
  if (experience.length > 0) {
    const experienceFilter = experience.map((exp: any) => 
      `description.ilike.%${exp.position}%`
    ).join(',');
    query = query.or(experienceFilter);
  }

  const { data: jobs } = await query.limit(5);
  return jobs || [];
}

function formatJobResponse(jobs: any[], userProfile: any) {
  let response = '';
  const { city, skills = [] } = userProfile;

  if (jobs.length === 0) {
    return "Je n'ai pas trouvé d'emplois correspondant exactement à votre profil pour le moment. Voulez-vous que j'élargisse les critères de recherche ?";
  }

  response = "J'ai trouvé quelques emplois qui correspondent à votre profil :\n\n";
  
  jobs.forEach((job, index) => {
    response += `${index + 1}. ${job.title} 🏢 ${job.company}\n`;
    response += `📍 ${job.location}`;
    
    if (city && job.location.toLowerCase().includes(city.toLowerCase())) {
      response += " (dans votre ville)";
    }
    response += "\n";

    // Trouver les compétences correspondantes
    const matchingSkills = skills.filter((skill: string) => 
      job.description?.toLowerCase().includes(skill.toLowerCase())
    );
    
    if (matchingSkills.length > 0) {
      response += `✨ Compétences requises : ${matchingSkills.join(', ')}\n`;
    }

    response += `🔗 ${job.url}\n\n`;
  });

  return response + "Voulez-vous que je vous aide à postuler à l'un de ces emplois ?";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Récupérer le profil complet de l'utilisateur
    const { data: userProfile } = await supabase
      .from('profiles')
      .select(`
        *,
        experiences (*),
        education (*),
        certifications (*)
      `)
      .eq('id', userId)
      .single();

    if (!userProfile) {
      throw new Error("Profil utilisateur non trouvé");
    }

    const conversationManager = new ConversationManager({
      recentMessages: context.previousMessages || [],
      userQuery: message,
      userProfile
    });

    const intent = conversationManager.analyzeIntent(message);
    let response: string;
    let suggestedJobs: any[] = [];

    if (intent === 'recherche_emploi') {
      suggestedJobs = await findRelevantJobs(supabase, userProfile);
      response = formatJobResponse(suggestedJobs, userProfile);
    } else {
      // Gérer les autres types de conversations...
      response = "Je suis là pour vous aider. Que souhaitez-vous savoir sur les opportunités d'emploi ?";
    }

    // Sauvegarder l'interaction pour apprentissage
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
      JSON.stringify({ 
        response,
        suggestedJobs,
        context: {
          intent,
          lastQuery: message
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler votre demande ?" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
