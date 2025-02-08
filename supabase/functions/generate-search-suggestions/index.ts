
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

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) throw new Error('Missing Hugging Face API key');

    // Générer le contexte basé sur le profil
    const baseContext = `
      En tant qu'assistant pour la recherche d'emploi, génère une suggestion de recherche utile et pertinente.
      
      Contexte de l'utilisateur:
      - Rôle: ${profile.role}
      - Compétences: ${profile.skills?.join(', ') || 'Non spécifiées'}
      - Industrie: ${profile.industry || 'Non spécifiée'}
      - Ville: ${profile.city || 'Non spécifié'}
      - Province: ${profile.state || 'Non spécifiée'}
      
      Les suggestions doivent:
      - Être en français
      - Être pertinentes pour le secteur de la construction
      - Inclure le lieu si spécifié dans le profil
      - Utiliser les compétences de l'utilisateur
      - Être spécifiques et ciblées
      
      Format souhaité: Une suggestion de recherche d'emploi complète
    `;

    // Appel à l'API Hugging Face
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
            max_new_tokens: 100,
            temperature: 0.8,
            top_p: 0.95,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', errorText);
      throw new Error('Failed to generate suggestion');
    }

    const data = await response.json();
    
    let suggestion = '';
    if (data && Array.isArray(data) && data[0]?.generated_text) {
      // Nettoyer et formater la suggestion
      suggestion = data[0].generated_text
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[0-9.-\s]+/, '').trim())
        .find(line => line.length > 0) || '';
    }

    // Stocker la suggestion dans l'historique
    await supabaseAdmin
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: 'job_search_suggestion',
        response: suggestion,
        context: {
          profile: {
            role: profile.role,
            skills: profile.skills,
            location: profile.city,
            industry: profile.industry
          }
        },
        tags: ['job-search', 'suggestion']
      });

    return new Response(
      JSON.stringify({ suggestion }),
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
