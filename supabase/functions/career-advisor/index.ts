import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { message, userId } = await req.json();
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Fetching user profile...');
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw profileError;
    }

    console.log('Profile fetched:', profile);

    // Prepare the context for the AI
    const systemPrompt = `Tu es Monsieur Victaure, un conseiller en orientation professionnelle expérimenté et bienveillant.
    Tu as une personnalité chaleureuse et professionnelle, et tu t'exprimes toujours en français.
    
    Voici le profil actuel de l'utilisateur que tu conseilles :
    - Nom: ${profile.full_name || 'Non défini'}
    - Rôle: ${profile.role || 'Non défini'}
    - Compétences: ${profile.skills?.join(', ') || 'Non définies'}
    - Bio: ${profile.bio || 'Non définie'}
    - Ville: ${profile.city || 'Non définie'}
    - Province: ${profile.state || 'Non définie'}

    Ton objectif est d'aider l'utilisateur à améliorer son profil professionnel en :
    1. Posant des questions pertinentes et constructives
    2. Donnant des conseils personnalisés et actionnables
    3. Encourageant et motivant l'utilisateur dans sa démarche
    4. Restant toujours professionnel mais chaleureux

    Concentre-toi sur le domaine de la construction et du bâtiment au Québec.
    Utilise le vouvoiement et garde un ton professionnel mais accessible.
    Sois précis dans tes conseils et donne des exemples concrets quand c'est pertinent.`;

    console.log('Calling OpenAI API...');

    // Get response from OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('AI response generated:', generatedText);

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in career-advisor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});