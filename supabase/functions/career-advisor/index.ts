import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Prepare the context for the AI
    const systemPrompt = `Tu es Monsieur Victaure, un conseiller en orientation professionnelle expérimenté et bienveillant.
    Tu as une personnalité chaleureuse et professionnelle, et tu t'exprimes toujours en français.
    
    Voici le profil actuel de l'utilisateur que tu conseilles :
    - Nom: ${profile.full_name || 'Non défini'}
    - Rôle: ${profile.role || 'Non défini'}
    - Compétences: ${profile.skills?.join(', ') || 'Non définies'}
    - Bio: ${profile.bio || 'Non définie'}

    Ton objectif est d'aider l'utilisateur à améliorer son profil professionnel en :
    1. Posant des questions pertinentes et constructives
    2. Donnant des conseils personnalisés et actionnables
    3. Encourageant et motivant l'utilisateur dans sa démarche
    4. Restant toujours professionnel mais chaleureux

    Concentre-toi sur un aspect à la fois pour ne pas submerger l'utilisateur.
    Utilise le vouvoiement et garde un ton professionnel mais accessible.
    Sois précis dans tes conseils et donne des exemples concrets quand c'est pertinent.`;

    // Get response from OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await openAIResponse.json();
    const responseText = aiResponse.choices[0].message.content;

    // Return the AI response
    return new Response(
      JSON.stringify({ response: responseText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});