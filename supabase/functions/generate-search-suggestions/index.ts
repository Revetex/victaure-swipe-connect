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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { query, user_id, context } = await req.json();
    
    if (!query || !user_id) {
      throw new Error('Query and user ID are required');
    }

    const { profile, previousSuggestions = [] } = context || {};

    // Generate base suggestions based on the user's profile and search query
    const baseSuggestions = [
      `${query} ${profile?.city || 'Québec'}`,
      `${query} emploi ${profile?.role || 'construction'}`,
      `${query} formation ${profile?.skills?.[0] || ''}`,
      `${query} certification ${profile?.industry || 'construction'}`,
      `${query} opportunités ${profile?.state || 'Québec'}`,
    ].filter(Boolean);

    // Filter out any previously used suggestions
    const newSuggestions = baseSuggestions.filter(
      suggestion => !previousSuggestions.includes(suggestion)
    );

    // Shuffle the suggestions array
    const shuffledSuggestions = newSuggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // Get up to 3 random suggestions

    return new Response(
      JSON.stringify({ suggestions: shuffledSuggestions }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-search-suggestions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});