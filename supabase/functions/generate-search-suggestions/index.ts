
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

    // Get previous suggestions to avoid duplicates
    const { data: previousSuggestions } = await supabaseAdmin
      .from('ai_learning_data')
      .select('response')
      .eq('user_id', userId)
      .eq('question', 'job_search_suggestion')
      .order('created_at', { ascending: false })
      .limit(5);

    const previousTerms = previousSuggestions?.map(s => s.response) || [];

    const prompt = `<Instruction>Génère une suggestion de recherche d'emploi dans la construction (3 mots maximum):
- Profile: ${profile.role || 'professionnel'} à ${profile.city || 'Québec'}
- Compétences: ${profile.skills?.join(', ') || 'construction'}
- Format: une seule ligne de 3 mots maximum en français
- La suggestion doit être différente de: ${previousTerms.join(', ')}
- NE PAS inclure de ponctuation ou guillemets
</Instruction>`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 20,
            temperature: 1.0,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate suggestion');
    }

    const data = await response.json();
    let suggestion = data[0]?.generated_text?.trim() || '';
    
    // Ensure max 3 words
    suggestion = suggestion.split(' ').slice(0, 3).join(' ');
    
    // Remove any punctuation
    suggestion = suggestion.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    // Save the suggestion
    await supabaseAdmin
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: 'job_search_suggestion',
        response: suggestion,
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
