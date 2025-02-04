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
    const { query, user_id, context } = await req.json();
    const { profile, previousSuggestions = [] } = context;

    // Initialize HuggingFace
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));

    // Generate base context for the model
    const baseContext = `
      Génère 5 suggestions de recherche différentes en français pour un professionnel de la construction.
      Context: L'utilisateur est ${profile.role} et cherche: "${query}"
      Suggestions précédentes: ${previousSuggestions.join(', ')}
      Les suggestions doivent être:
      - Pertinentes pour le secteur de la construction
      - Différentes des suggestions précédentes
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
      .filter(line => !previousSuggestions.includes(line))
      .slice(0, 5);

    if (!suggestions.length) {
      throw new Error("Aucune suggestion générée");
    }

    return new Response(
      JSON.stringify({ suggestions }),
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