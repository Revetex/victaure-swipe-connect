
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recherche dans marketplace_items
    const { data: items, error: itemsError } = await supabase
      .from('marketplace_items')
      .select('*')
      .textSearch('searchable_text', query)
      .limit(50);

    if (itemsError) throw itemsError;

    // Recherche intelligente avec l'IA
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant spécialisé dans la recherche de produits et services sur un marketplace."
          },
          {
            role: "user",
            content: `Analysez cette requête de recherche et suggérez des mots-clés pertinents: ${query}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    const suggestedKeywords = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        items,
        suggestedKeywords,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
