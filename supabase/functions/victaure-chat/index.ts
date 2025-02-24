
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Fonction pour extraire les tags pertinents du message
const extractTags = (message: string): string[] => {
  const topics = [
    "emploi", "recrutement", "profil", "cv", "formation", 
    "compétences", "entretien", "carrière", "navigation", 
    "technique", "général", "aide"
  ];
  
  return topics.filter(topic => 
    message.toLowerCase().includes(topic.toLowerCase())
  );
};

// Fonction pour sauvegarder l'interaction pour l'apprentissage
const saveInteraction = async (
  question: string,
  response: string,
  userId: string | undefined,
  context: any
) => {
  try {
    const tags = extractTags(question);
    
    // Anonymisation du contexte en retirant les informations personnelles
    const safeContext = context ? {
      hasProfile: !!context.profile,
      userRole: context.profile?.role,
      hasExperience: (context.profile?.experiences?.length || 0) > 0,
      hasEducation: (context.profile?.education?.length || 0) > 0,
      hasCertifications: (context.profile?.certifications?.length || 0) > 0,
      hasSkills: (context.profile?.skills?.length || 0) > 0,
      country: context.profile?.country
    } : null;

    await supabase.from('ai_learning_data').insert({
      question,
      response,
      context: safeContext,
      tags,
      user_id: userId,
      metadata: {
        timestamp: new Date().toISOString(),
        messageLength: question.length,
        responseLength: response.length
      }
    });
  } catch (error) {
    console.error('Error saving interaction:', error);
  }
};

// Fonction pour récupérer les interactions pertinentes
const getRelevantInteractions = async (question: string, limit = 5) => {
  const tags = extractTags(question);
  if (tags.length === 0) return [];

  const { data, error } = await supabase
    .from('ai_learning_data')
    .select('question, response, context, feedback_score')
    .contains('tags', tags)
    .order('feedback_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching relevant interactions:', error);
    return [];
  }

  return data;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const currentUserMessage = messages[messages.length - 1]?.content || '';

    // Récupérer le profil de l'utilisateur
    let userProfile = null;
    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          role,
          bio,
          skills,
          city,
          country,
          experiences (
            position,
            company,
            start_date,
            end_date,
            description
          ),
          education (
            school_name,
            degree,
            field_of_study,
            start_date,
            end_date
          ),
          certifications (
            title,
            institution,
            year
          )
        `)
        .eq('id', userId)
        .single();

      if (!profileError) {
        userProfile = profile;
      }
    }

    // Récupérer les interactions pertinentes pour enrichir le contexte
    const relevantInteractions = await getRelevantInteractions(currentUserMessage);
    
    // Contexte de l'application enrichi avec l'historique d'apprentissage
    const appContext = `
Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi et le recrutement sur la plateforme Victaure.
Tu es chaleureux, empathique et très professionnel.

Interface de l'application :
- Le tableau de bord (/dashboard) permet d'accéder à toutes les fonctionnalités
- Les offres d'emploi (/jobs) permettent de rechercher et postuler à des emplois
- Les messages (/messages) permettent de communiquer avec d'autres utilisateurs
- Les connexions (/connections) permettent de gérer son réseau professionnel
- Les outils (/tools) donnent accès à des outils utiles comme le traducteur ou la calculatrice
- Les paramètres (/settings) permettent de configurer son profil et ses préférences

${userProfile ? `
Informations sur l'utilisateur (à ne jamais divulguer directement) :
- Rôle : ${userProfile.role || 'Non renseigné'}
- A complété son profil : ${!!userProfile.bio}
- Nombre d'expériences : ${userProfile.experiences?.length || 0}
- Nombre de formations : ${userProfile.education?.length || 0}
- Nombre de certifications : ${userProfile.certifications?.length || 0}
- A des compétences renseignées : ${(userProfile.skills?.length || 0) > 0}
` : 'Utilisateur non connecté'}

${relevantInteractions.length > 0 ? `
Interactions précédentes pertinentes pour enrichir le contexte (à ne pas mentionner directement):
${relevantInteractions.map(i => `Question similaire : ${i.question}\nRéponse efficace : ${i.response}`).join('\n\n')}
` : ''}

Directives importantes :
1. Ne JAMAIS divulguer d'informations personnelles des utilisateurs
2. Adapter ton langage et tes conseils au profil de l'utilisateur
3. Guider vers les fonctionnalités pertinentes de l'application
4. Encourager l'amélioration du profil si des informations manquent
5. Rester professionnel tout en étant chaleureux
6. Pour les utilisateurs non connectés, suggérer l'inscription pour accéder à plus de fonctionnalités
`;

    const messagesWithContext = [
      { role: "system", content: appContext },
      ...messages.slice(1)
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
        'X-Title': 'Victaure Assistant',
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: messagesWithContext,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    // Sauvegarder l'interaction pour l'apprentissage
    if (data?.choices?.[0]?.message?.content) {
      await saveInteraction(
        currentUserMessage,
        data.choices[0].message.content,
        userId,
        { profile: userProfile }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
