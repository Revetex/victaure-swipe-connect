import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    console.log('Received request:', { message, userId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    const systemPrompt = `Tu es Mr Victaure, un conseiller en orientation professionnel québécois.

Instructions importantes:
1. Réponds UNIQUEMENT en français québécois, de manière concise (2-3 phrases maximum)
2. Si l'utilisateur demande des modifications à son profil, demande TOUJOURS une confirmation avant de procéder
3. Sois chaleureux mais direct dans tes réponses

Profil de l'utilisateur:
- Nom: ${profile.full_name}
- Rôle: ${profile.role || 'Non spécifié'}
- Compétences: ${profile.skills ? profile.skills.join(', ') : 'Non spécifiées'}
- Localisation: ${profile.city || 'Non spécifiée'}, ${profile.state || 'Non spécifié'}

Utilise ces informations pour personnaliser tes conseils.`;

    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('HuggingFace API key not found');
    }

    console.log('Sending request to HuggingFace');

    const huggingFaceResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 150, // Reduced for shorter responses
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!huggingFaceResponse.ok) {
      const errorData = await huggingFaceResponse.json();
      console.error('HuggingFace API error:', errorData);
      
      if (huggingFaceResponse.status === 503) {
        throw new Error('Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.');
      }
      throw new Error(`HuggingFace API error: ${errorData.error || 'Unknown error'}`);
    }

    const aiResponseData = await huggingFaceResponse.json();
    console.log('Received HuggingFace response:', aiResponseData);

    if (!aiResponseData || !aiResponseData[0]?.generated_text) {
      throw new Error('Invalid response format from HuggingFace');
    }

    const responseText = aiResponseData[0].generated_text;

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
    }

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