
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw new Error('Error fetching profile');
    if (!profile) throw new Error('Profile not found');

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) throw new Error('Missing Hugging Face API key');

    const baseContext = `
      Tu es un expert du domaine de la construction au Québec. Génère 5 suggestions de recherche différentes en français pour un professionnel de la construction.
      
      Contexte sur l'utilisateur:
      - Rôle: ${profile.role || 'Professionnel de la construction'}
      - Expérience: ${profile.experience_level || 'Non spécifié'}
      - Localisation: ${profile.city || 'Québec'}
      
      Les suggestions doivent être:
      - Très spécifiques au secteur de la construction
      - Pertinentes pour le marché québécois
      - Diversifiées (emploi, formation, équipement, réglementation, etc.)
      - En français
      - Sous forme de requêtes de recherche complètes
      
      Format: Une suggestion par ligne, sans numérotation.
    `;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: baseContext,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.8,
            top_p: 0.95,
            repetition_penalty: 1.2
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate suggestions');
    }

    const result = await response.json();
    const suggestions = result[0].generated_text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line && !line.includes('Assistant:') && !line.includes('System:'))
      .slice(0, 5);

    if (!suggestions.length) {
      throw new Error("Aucune suggestion générée");
    }

    // Store the suggestions in learning data for future improvement
    await supabaseAdmin
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        context: {
          profile,
          type: 'search_suggestions',
          suggestions
        }
      });

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
