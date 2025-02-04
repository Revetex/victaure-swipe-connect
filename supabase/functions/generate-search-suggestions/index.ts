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
    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user ID from request
    const { user_id } = await req.json();
    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('skills, role, city, state, country')
      .eq('id', user_id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Create context for AI
    const context = `Generate 5 relevant job search suggestions in French for a ${profile.role} professional.
    Their skills include: ${profile.skills?.join(', ') || 'various construction skills'}.
    Location: ${[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Canada'}.
    The suggestions should be job search queries that would be useful for finding relevant positions.
    Format: Return only an array of strings, each being a search suggestion.`;

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: context,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API request failed');
    }

    const result = await response.json();
    console.log('Hugging Face response:', result);

    // Parse the response to extract suggestions
    let suggestions: string[] = [];
    try {
      // The model should return a text that we can parse as an array
      const text = result[0].generated_text;
      // Extract suggestions using regex
      suggestions = text.match(/["'](.+?)["']/g)?.map(s => s.replace(/["']/g, '')) || [];
      // Ensure we have at least some suggestions
      if (suggestions.length === 0) {
        suggestions = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.includes('[') && !line.includes(']'))
          .slice(0, 5);
      }
      // Limit to 5 suggestions
      suggestions = suggestions.slice(0, 5);
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      // Fallback suggestions
      suggestions = [
        `${profile.role} ${profile.city || 'Québec'}`,
        `emplois construction ${profile.state || 'Québec'}`,
        `offres d'emploi ${profile.skills?.[0] || 'construction'}`,
        `recrutement ${profile.role} expérimenté`,
        `${profile.role} temps plein`
      ];
    }

    return new Response(
      JSON.stringify({ suggestions }),
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