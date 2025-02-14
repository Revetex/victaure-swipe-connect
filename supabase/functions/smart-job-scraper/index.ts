
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const searchEngineId = "1262c5460a0314a80";
    const apiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY');

    if (!apiKey) {
      throw new Error('Google Search API key not configured');
    }

    // Faire la recherche via l'API Google Custom Search
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=jobs`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Initialiser le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Traiter les résultats et les sauvegarder dans Supabase
    if (data.items) {
      for (const item of data.items) {
        const jobData = {
          title: item.title,
          description: item.snippet,
          url: item.link,
          source: 'google_search',
          posted_at: new Date().toISOString(),
          raw_data: item,
        };

        const { error } = await supabaseClient
          .from('scraped_jobs')
          .upsert(
            jobData,
            { onConflict: 'url' }
          );

        if (error) {
          console.error('Error saving job:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Jobs scraped successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
