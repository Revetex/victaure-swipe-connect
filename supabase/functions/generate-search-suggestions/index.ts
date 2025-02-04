import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
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
    const { userId } = await req.json();
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw new Error('Error fetching profile');
    if (!profile) throw new Error('Profile not found');

    // Initialize HuggingFace
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));

    // Generate base context for the model
    const baseContext = `
      Génère 5 suggestions de recherche différentes en français pour un professionnel de la construction.
      Context: L'utilisateur est ${profile.role} et cherche des opportunités dans son domaine.
      Les suggestions doivent être:
      - Pertinentes pour le secteur de la construction
      - Spécifiques et détaillées
      - En français
      Format: Une suggestion par ligne
    `;

    // Use text generation to get suggestions
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: baseContext,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.8,
        top_p: 0.95,
        repetition_penalty: 1.2
      }
    });

    // Parse the response into an array of suggestions
    const suggestions = response.generated_text
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 5);

    if (!suggestions.length) {
      throw new Error("Aucune suggestion générée");
    }

    return new Response(
      JSON.stringify({ suggestion: suggestions[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});