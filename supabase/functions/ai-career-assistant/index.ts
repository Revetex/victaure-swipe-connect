
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
    const { message, userId, context, audioFormat = false } = await req.json();
    const { previousMessages, userProfile } = context;

    console.log("Processing request with:", { message, userId, audioFormat });

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

    // Analyze message intent
    let intent = '';
    if (message.toLowerCase().includes('cv')) {
      intent = 'cv';
    } else if (message.toLowerCase().includes('lettre') || message.toLowerCase().includes('motivation')) {
      intent = 'cover_letter';
    } else if (message.toLowerCase().includes('emploi') || message.toLowerCase().includes('job')) {
      intent = 'job_search';
    }

    // Store user interaction
    await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        interaction_type: 'chat',
        content: message,
        metadata: { intent }
      });

    // Prepare conversation context with enhanced profile info
    const conversationContext = `Tu es M. Victaure, un assistant de carrière spécialisé dans les emplois de construction au Québec.
    Ton rôle est d'être proactif et d'aider les utilisateurs dans leur recherche d'emploi.
    
    Objectifs principaux:
    1. Aider à compléter le profil utilisateur
    2. Suggérer des emplois pertinents
    3. Aider à la création de CV et lettres de motivation
    4. Accompagner dans les candidatures
    
    Profil actuel de l'utilisateur:
    ${JSON.stringify({
      ...userProfile,
      interactions: previousMessages.length
    }, null, 2)}
    
    Historique récent:
    ${previousMessages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
    
    Message actuel: ${message}
    
    Instructions spéciales:
    - Si le profil est incomplet, pose des questions pour le compléter
    - Suggère des emplois qui correspondent au profil
    - Propose de l'aide pour le CV ou la lettre de motivation si pertinent
    - Maintiens un ton professionnel mais amical
    - Communique toujours en français
    - Sois proactif dans tes suggestions`;

    // Generate response using Janus model
    const response = await hf.textGeneration({
      model: 'deepseek-ai/Janus-Pro-7B',
      inputs: conversationContext,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
      }
    });

    // Translate response to French
    const translationResponse = await hf.translation({
      model: 'facebook/nllb-200-distilled-600M',
      inputs: response.generated_text || "",
      parameters: {
        src_lang: "eng_Latn",
        tgt_lang: "fra_Latn"
      }
    });

    const textResponse = translationResponse.translation_text || "Je m'excuse, je n'ai pas pu générer une réponse appropriée.";

    // Generate audio if requested
    let audioContent = null;
    if (audioFormat) {
      const audioResponse = await hf.textToSpeech({
        model: 'facebook/mms-tts-fra',
        inputs: textResponse
      });
      const arrayBuffer = await audioResponse.arrayBuffer();
      audioContent = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }

    // Update profile if needed
    if (userProfile && message.toLowerCase().includes('oui') && previousMessages.length > 0) {
      try {
        const profileUpdates: any = {};
        const lastMessage = previousMessages[previousMessages.length - 1].content.toLowerCase();

        // Extract skills
        if (lastMessage.includes('compétence')) {
          const skillsPrompt = `Extract professional skills from this text. Respond with a list, one skill per line: ${message}`;
          const skillsResponse = await hf.textGeneration({
            model: 'deepseek-ai/Janus-Pro-7B',
            inputs: skillsPrompt,
            parameters: {
              max_new_tokens: 100,
              temperature: 0.3,
              return_full_text: false
            }
          });

          if (skillsResponse.generated_text) {
            const skillsTranslation = await hf.translation({
              model: 'facebook/nllb-200-distilled-600M',
              inputs: skillsResponse.generated_text,
              parameters: {
                src_lang: "eng_Latn",
                tgt_lang: "fra_Latn"
              }
            });

            profileUpdates.skills = skillsTranslation.translation_text
              .split('\n')
              .filter((skill: string) => skill.trim().length > 0)
              .map((skill: string) => skill.trim().replace(/^[-*]\s*/, ''));
          }
        }

        // Extract career objectives
        if (lastMessage.includes('objectif') || lastMessage.includes('carrière')) {
          profileUpdates.career_objectives = message;
        }

        // Extract preferred locations
        if (lastMessage.includes('lieu') || lastMessage.includes('région')) {
          profileUpdates.preferred_locations = message.split(',').map(loc => loc.trim());
        }

        // Update profile if we have changes
        if (Object.keys(profileUpdates).length > 0) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', userId);

          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
        }
      } catch (error) {
        console.error("Error processing profile update:", error);
      }
    }

    // Search for relevant jobs based on user profile
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

    // Calculate job match scores
    const matchedJobs = jobs.map((job: any) => {
      let score = 0;
      
      // Match skills
      if (userProfile.skills) {
        const matchingSkills = userProfile.skills.filter((skill: string) => 
          job.required_skills?.includes(skill) || job.preferred_skills?.includes(skill)
        );
        score += matchingSkills.length * 2;
      }

      // Match location
      if (userProfile.preferred_locations?.includes(job.location)) {
        score += 3;
      }

      // Match work type
      if (userProfile.preferred_work_type?.includes(job.contract_type)) {
        score += 2;
      }

      return {
        ...job,
        match_score: score
      };
    }).sort((a: any, b: any) => b.match_score - a.match_score);

    return new Response(
      JSON.stringify({
        message: textResponse,
        audioContent,
        suggestedJobs: matchedJobs,
        userProfile, // Include current profile for UI updates
        intent // Include detected intent for UI handling
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
