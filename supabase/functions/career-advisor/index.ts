import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    console.log('Received request:', { message, userId });

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

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    if (!profile) {
      throw new Error('Profile not found');
    }

    console.log('Found profile:', profile);

    // Prepare the context for the AI
    const systemPrompt = `Tu es Mr Victaure, un conseiller en orientation professionnelle expert et bienveillant. 
    Tu aides les utilisateurs à améliorer leur profil professionnel en posant des questions pertinentes et en donnant des conseils constructifs.
    Voici le profil actuel de l'utilisateur :
    - Nom: ${profile.full_name || 'Non défini'}
    - Rôle: ${profile.role || 'Non défini'}
    - Compétences: ${profile.skills?.join(', ') || 'Non définies'}
    - Bio: ${profile.bio || 'Non définie'}

    Pose des questions pertinentes pour aider l'utilisateur à améliorer son profil. 
    Concentre-toi sur un aspect à la fois.
    Sois encourageant et bienveillant dans tes réponses.
    Suggère des améliorations concrètes basées sur les réponses de l'utilisateur.`;

    console.log('Sending request to OpenAI');

    // Get response from OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiResponseData = await openAIResponse.json();
    console.log('Received OpenAI response:', aiResponseData);

    if (!aiResponseData.choices || !aiResponseData.choices[0] || !aiResponseData.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    const responseText = aiResponseData.choices[0].message.content;

    // Store the conversation in the database
    const { error: chatError } = await supabase
      .from('ai_chat_messages')
      .insert([
        {
          user_id: userId,
          content: message,
          sender: 'user'
        },
        {
          user_id: userId,
          content: responseText,
          sender: 'advisor'
        }
      ]);

    if (chatError) {
      console.error('Error storing chat messages:', chatError);
      // Don't throw here, we still want to return the response to the user
    }

    // Return the AI response
    return new Response(
      JSON.stringify({ response: responseText }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  } catch (error) {
    console.error('Error in career-advisor function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});