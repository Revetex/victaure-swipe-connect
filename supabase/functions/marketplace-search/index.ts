
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log("Recherche reçue:", query);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recherche dans toutes les tables pertinentes
    const tablesARechercher = ['marketplace_listings', 'marketplace_services', 'marketplace_jobs'];
    let allResults = [];

    for (const table of tablesARechercher) {
      console.log(`Recherche dans la table ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20);

      if (error) {
        console.error(`Erreur lors de la recherche dans ${table}:`, error);
        continue;
      }

      if (data) {
        allResults = [...allResults, ...data.map(item => ({ ...item, source: table }))];
      }
    }

    // Analyse IA pour suggestions et catégorisation
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
            content: "Vous êtes un assistant spécialisé dans l'analyse de recherche de marketplace. Analysez la requête et fournissez des suggestions pertinentes en français."
          },
          {
            role: "user",
            content: `Analysez cette requête "${query}" et suggérez:
              1. Des mots-clés alternatifs
              2. Des catégories possibles
              3. Des suggestions de filtres
              Répondez en JSON avec ces 3 sections.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    console.log("Réponse IA:", aiData);

    return new Response(
      JSON.stringify({
        results: allResults,
        aiSuggestions: aiData.choices[0].message.content,
        totalResults: allResults.length,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Erreur dans la fonction de recherche:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Une erreur est survenue lors de la recherche"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
