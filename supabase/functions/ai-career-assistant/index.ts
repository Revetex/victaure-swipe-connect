
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

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

    // Get Hugging Face token
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('Hugging Face token not configured');
    }

    const hf = new HfInference(hfToken);

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

    // Call Hugging Face API for text generation using Mixtral model
    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: conversationContext,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    console.log("Received response from Hugging Face:", response);

    const assistantMessage = response.generated_text || "Je m'excuse, je n'ai pas pu générer une réponse appropriée.";

    // Update user profile if needed
    if (userProfile && message.toLowerCase().includes('oui') && previousMessages.length > 0) {
      try {
        // Extract skills using Hugging Face model
        const skillsResponse = await hf.textGeneration({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs: `Extrais uniquement les compétences professionnelles mentionnées dans ce message: ${message}`,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.3,
            return_full_text: false
          }
        });

        if (skillsResponse.generated_text) {
          const skills = skillsResponse.generated_text
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
