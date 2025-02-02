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
      .select('skills, role, city, state')
      .eq('id', user_id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Generate search suggestions based on profile
    const suggestions = [];
    
    // Add location-based suggestion
    if (profile.city || profile.state) {
      const location = [profile.city, profile.state].filter(Boolean).join(', ');
      suggestions.push(`emplois ${profile.role || 'construction'} ${location}`);
    }

    // Add skills-based suggestions
    if (profile.skills?.length > 0) {
      const topSkills = profile.skills.slice(0, 3);
      suggestions.push(`offres d'emploi ${topSkills.join(' ')} Québec`);
    }

    // Add role-based suggestion
    if (profile.role) {
      suggestions.push(`${profile.role} recrutement immédiat`);
    }

    // Add a general construction suggestion
    suggestions.push('emplois construction Québec');

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