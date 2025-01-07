import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { skills, experiences, education } = await req.json()

    // Create a professional bio based on the provided information
    let bio = "Professional with "

    // Add experience summary
    if (experiences && experiences.length > 0) {
      const latestExperience = experiences[0]
      bio += `expertise as ${latestExperience.position} at ${latestExperience.company}`
    }

    // Add skills
    if (skills && skills.length > 0) {
      bio += `. Skilled in ${skills.slice(0, 3).join(", ")}`
      if (skills.length > 3) {
        bio += ` and other technologies`
      }
    }

    // Add education
    if (education && education.length > 0) {
      const latestEducation = education[0]
      bio += `. Holds a ${latestEducation.degree} in ${latestEducation.field_of_study} from ${latestEducation.school_name}`
    }

    bio += ". Committed to delivering high-quality results and continuous professional growth."

    return new Response(
      JSON.stringify({ bio }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error generating bio:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})