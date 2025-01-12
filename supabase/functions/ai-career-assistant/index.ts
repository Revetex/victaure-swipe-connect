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

    // Fetch additional user data
    const { data: userEducation } = await supabase
      .from('education')
      .select('*')
      .eq('profile_id', userId);

    const { data: userExperiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', userId);

    const { data: userCertifications } = await supabase
      .from('certifications')
      .select('*')
      .eq('profile_id', userId);

    // Prepare conversation context with rich user data
    const conversationContext = `Tu es M. Victaure, un conseiller en orientation professionnelle expérimenté au Québec avec plus de 15 ans d'expérience.

Ton style de communication:
- Parle de façon naturelle et chaleureuse, comme un vrai Québécois
- Utilise des expressions québécoises appropriées
- Sois empathique et à l'écoute
- Évite les réponses toutes faites ou trop formelles
- Adapte ton langage au contexte de la personne
- Pose des questions pertinentes pour mieux comprendre la situation

Profil de l'utilisateur:
${JSON.stringify(userProfile, null, 2)}

Formation:
${JSON.stringify(userEducation, null, 2)}

Expérience:
${JSON.stringify(userExperiences, null, 2)}

Certifications:
${JSON.stringify(userCertifications, null, 2)}

Messages précédents:
${previousMessages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}

Message actuel: ${message}

Important:
- Base tes conseils sur ton expertise du marché du travail québécois
- Sois précis et concret dans tes recommandations
- Montre que tu comprends vraiment la situation unique de la personne
- N'hésite pas à partager des anecdotes pertinentes de ton expérience`;

    // Call Hugging Face API with enhanced context
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
            temperature: 0.85,
            top_p: 0.95,
            repetition_penalty: 1.15,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      console.error("Hugging Face API error:", await response.text());
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const assistantMessage = result[0]?.generated_text || "Je m'excuse, je n'ai pas pu générer une réponse appropriée.";

    // Search for relevant jobs based on user profile and conversation
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