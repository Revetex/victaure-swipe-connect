import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleJobSearch } from "./handlers/jobSearch.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Québec, spécialisé dans le domaine de la construction. Tu travailles sur une plateforme de mise en relation entre professionnels et employeurs de la construction.

Tu dois adapter tes réponses en fonction du profil de l'utilisateur que tu reçois dans le contexte.
Utilise son nom, ses compétences, son expérience et son rôle pour personnaliser tes réponses.

Si l'utilisateur est un professionnel:
- Aide-le à trouver des offres d'emploi pertinentes
- Suggère-lui des moyens d'améliorer son profil
- Conseille-le sur les certifications utiles dans son domaine

Si l'utilisateur est un employeur:
- Aide-le à rédiger et publier des offres d'emploi
- Conseille-le sur les profils qui pourraient l'intéresser
- Guide-le dans sa recherche de talents

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
- Tu suggères toujours des actions concrètes
- Tu t'adresses à l'utilisateur par son nom quand tu le connais
- Tu fais référence à son profil et son expérience dans tes réponses
- Tu adaptes tes conseils selon que l'utilisateur est un professionnel ou un employeur`;

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
      // Prepare a personalized response using the user's complete profile
      const userName = userProfile?.full_name || "cher utilisateur";
      const userRole = userProfile?.role || '';
      const userSkills = userProfile?.skills?.join(', ') || '';
      const latestExperience = userProfile?.experiences?.[0];
      const latestEducation = userProfile?.education?.[0];
      const certifications = userProfile?.certifications || [];

      let personalizedContext = ``;
      
      if (userRole === 'professional') {
        personalizedContext = `
          ${userSkills ? `avec vos compétences en ${userSkills}` : ''} 
          ${latestExperience ? `et votre expérience chez ${latestExperience.company} en tant que ${latestExperience.position}` : ''}
          ${latestEducation ? `ainsi que votre formation en ${latestEducation.field_of_study || latestEducation.degree}` : ''}
          ${certifications.length > 0 ? `et vos certifications en ${certifications.map(c => c.title).join(', ')}` : ''}
        `.trim();
      } else if (userRole === 'employer') {
        personalizedContext = `en tant qu'employeur${userProfile?.company_name ? ` chez ${userProfile.company_name}` : ''}`;
      }

      // Réponse générale avec suggestions d'actions
      response = {
        message: `Bonjour ${userName}, je suis là pour vous aider ${personalizedContext}. Comment puis-je vous assister aujourd'hui ?`,
        suggestedActions: userRole === 'professional' ? [
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