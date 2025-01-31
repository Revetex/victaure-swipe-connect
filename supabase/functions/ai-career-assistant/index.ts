import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    const { previousMessages, userProfile } = context;

    console.log("Processing request with:", { message, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Hugging Face API key
    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Prepare conversation context
    const conversationContext = `Tu es M. Victaure, un assistant de carrière spécialisé dans les emplois de construction au Québec.
    Ton rôle est d'aider les utilisateurs à identifier leurs compétences et leurs aspirations professionnelles.
    Tu dois poser des questions pertinentes sur leur expérience et leurs préférences.
    Basé sur leurs réponses, suggère des catégories d'emploi et aide à mettre à jour leur profil.
    Communique toujours en français et maintiens un ton professionnel mais amical.
    
    Profil de l'utilisateur:
    ${JSON.stringify(userProfile, null, 2)}
    
    Messages précédents:
    ${previousMessages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
    
    Message actuel: ${message}`;

    console.log("Sending request to Hugging Face API");

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: conversationContext,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
          }
        }),
      }
    );

    if (!response.ok) {
      console.error("Hugging Face API error:", await response.text());
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Received response from Hugging Face:", result);

    const assistantMessage = result[0]?.generated_text || "Je m'excuse, je n'ai pas pu générer une réponse appropriée.";

    // Update user profile if needed
    if (userProfile && message.toLowerCase().includes('oui') && previousMessages.length > 0) {
      try {
        // Extract skills from the conversation
        const skillsResponse = await fetch(
          "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
          {
            headers: {
              "Authorization": `Bearer ${huggingFaceApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `Extrais les compétences professionnelles mentionnées dans ce texte et retourne-les sous forme de liste: ${message}`,
              parameters: {
                max_new_tokens: 100,
                temperature: 0.3,
              }
            }),
          }
        );

        if (skillsResponse.ok) {
          const skillsResult = await skillsResponse.json();
          const skills = skillsResult[0]?.generated_text
            .split('\n')
            .filter((skill: string) => skill.trim().length > 0)
            .map((skill: string) => skill.trim().replace(/^[-*]\s*/, ''));

          if (skills.length > 0) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ skills })
              .eq('id', userId);

            if (updateError) {
              console.error("Error updating profile:", updateError);
            }
          }
        }
      } catch (error) {
        console.error("Error processing skills:", error);
      }
    }

    // Search for relevant jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5);

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      throw jobsError;
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        suggestedJobs: jobs
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue", 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});