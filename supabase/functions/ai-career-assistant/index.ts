import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.6.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const hfApiKey = Deno.env.get('HUGGING_FACE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const hf = new HfInference(hfApiKey);

    const { message, userId, context } = await req.json();

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Generate personalized response using HF model
    const response = await hf.textGeneration({
      model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      inputs: `Tu es un assistant professionnel spécialisé dans l'orientation et le conseil en carrière.
      Profil de l'utilisateur: ${JSON.stringify(profile)}
      Message de l'utilisateur: ${message}
      
      Réponds de manière professionnelle et empathique, en français.`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }
    });

    // Store conversation in database
    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      content: message,
      sender: 'user'
    });

    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      content: response.generated_text,
      sender: 'assistant'
    });

    // Get relevant job matches
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .limit(3);

    return new Response(
      JSON.stringify({
        message: response.generated_text,
        suggestedJobs: jobs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});