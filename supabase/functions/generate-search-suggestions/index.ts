
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

    // Vérifier l'historique des suggestions récentes
    const { data: recentSuggestions } = await supabaseAdmin
      .from('ai_learning_data')
      .select('response')
      .eq('user_id', userId)
      .eq('question', 'job_search_suggestion')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentSuggestionsList = recentSuggestions?.map(s => s.response) || [];

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) throw new Error('Missing Hugging Face API key');

    // Générer le contexte basé sur le profil
    const baseContext = `<Instruction>En tant qu'assistant pour la recherche d'emploi, génère une suggestion de recherche unique et créative.
      
Tu dois générer UNE SEULE suggestion d'emploi basée sur ce profil:
- Rôle actuel: ${profile.role}
- Compétences: ${profile.skills?.join(', ') || 'Non spécifiées'}
- Industrie: ${profile.industry || 'Non spécifiée'}
- Ville: ${profile.city || 'Non spécifié'}
- Province: ${profile.state || 'Non spécifiée'}

Format:
- Une seule ligne
- En français
- Pertinente pour le secteur de la construction
- Inclut le lieu si spécifié dans le profil
- Utilise les compétences appropriées de façon créative
- Évite ces suggestions précédentes: ${recentSuggestionsList.join(', ')}

Réponse en une ligne directe sans explication.</Instruction>`;

    // Appel à l'API Hugging Face avec une température plus élevée pour plus de créativité
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
            temperature: 0.95, // Température plus élevée pour plus de variété
            top_p: 0.98,      // Augmenté pour plus de créativité
            top_k: 50,        // Ajouté pour plus de diversité
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
      suggestion = data[0].generated_text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)[0] || '';
    }

    // Stocker la suggestion dans l'historique seulement si elle est unique
    if (suggestion && !recentSuggestionsList.includes(suggestion)) {
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
    }

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
