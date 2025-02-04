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
    const possibleFormats = [
      // Location-based formats
      (role: string, location: string) => `emplois ${role} ${location}`,
      (role: string, location: string) => `recrutement ${role} ${location}`,
      (role: string, location: string) => `offres d'emploi ${role} ${location}`,
      
      // Skills-based formats
      (skills: string[]) => `emplois ${skills.join(' ')} Québec`,
      (skills: string[]) => `offres ${skills.join(' ')} Montréal`,
      (skills: string[]) => `recrutement ${skills.join(' ')} Canada`,
      
      // Role-based formats
      (role: string) => `${role} temps plein`,
      (role: string) => `${role} urgent`,
      (role: string) => `${role} débutant`,
      (role: string) => `${role} expérimenté`,
    ];

    // Add location-based suggestions
    if (profile.city || profile.state) {
      const location = [profile.city, profile.state].filter(Boolean).join(', ');
      const randomLocationFormats = possibleFormats
        .slice(0, 3)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      randomLocationFormats.forEach(format => {
        suggestions.push(format(profile.role || 'construction', location));
      });
    }

    // Add skills-based suggestions
    if (profile.skills?.length > 0) {
      const randomSkills = [...profile.skills]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      const randomSkillsFormat = possibleFormats
        .slice(3, 6)
        .sort(() => Math.random() - 0.5)[0];
      
      suggestions.push(randomSkillsFormat(randomSkills));
    }

    // Add role-based suggestions
    if (profile.role) {
      const randomRoleFormats = possibleFormats
        .slice(6)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      randomRoleFormats.forEach(format => {
        suggestions.push(format(profile.role));
      });
    }

    // Always add a general construction suggestion as fallback
    suggestions.push('emplois construction Québec');

    // Shuffle final array
    const shuffledSuggestions = suggestions
      .filter(Boolean)
      .sort(() => Math.random() - 0.5);

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