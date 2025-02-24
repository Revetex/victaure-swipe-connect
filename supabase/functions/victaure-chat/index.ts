
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    // Récupérer le profil de l'utilisateur s'il est connecté
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

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        userProfile = profile;
      }
    }

    // Contexte de l'application pour Mr. Victaure
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
Informations sur l'utilisateur :
- Nom : ${userProfile.full_name || 'Non renseigné'}
- Rôle : ${userProfile.role || 'Non renseigné'}
- Localisation : ${userProfile.city ? `${userProfile.city}, ${userProfile.country}` : 'Non renseignée'}
- Compétences : ${userProfile.skills?.join(', ') || 'Non renseignées'}
- Nombre d'expériences : ${userProfile.experiences?.length || 0}
- Nombre de formations : ${userProfile.education?.length || 0}
- Nombre de certifications : ${userProfile.certifications?.length || 0}
` : 'Aucun profil utilisateur disponible - il s\'agit probablement d\'un visiteur non connecté.'}

Ta mission est d'aider les utilisateurs à :
1. Naviguer et utiliser efficacement toutes les fonctionnalités de l'application
2. Optimiser leur profil professionnel
3. Trouver des opportunités d'emploi pertinentes
4. Développer leur réseau professionnel
5. Utiliser les outils disponibles pour améliorer leur employabilité

Réponds toujours de manière professionnelle mais chaleureuse. 
Si l'utilisateur est connecté, personnalise tes réponses en fonction de son profil.
Guide les utilisateurs non connectés vers l'inscription pour accéder à plus de fonctionnalités.
`;

    // Ajout du contexte de l'application au début des messages
    const messagesWithContext = [
      { role: "system", content: appContext },
      ...messages.slice(1) // On garde tous les messages sauf le premier qui était l'ancien contexte
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
    console.log("OpenRouter response:", data);

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
