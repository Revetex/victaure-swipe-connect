
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface Profile {
  id: string;
  skills: string[];
  experience_level: string;
  preferred_locations: string[];
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  required_skills: string[];
  experience_level: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id } = await req.json();

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) throw profileError;

    // Récupérer les emplois récents
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('scraped_jobs')
      .select('*')
      .gte('posted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (jobsError) throw jobsError;

    // Analyser la correspondance entre le profil et les emplois
    const jobMatches = jobs.map(job => {
      const skillMatch = calculateSkillMatch(profile.skills || [], job.skills || []);
      const locationMatch = calculateLocationMatch(profile.preferred_locations || [], job.location);
      const experienceMatch = calculateExperienceMatch(profile.experience_level, job.experience_level);

      const score = (skillMatch * 0.5) + (locationMatch * 0.3) + (experienceMatch * 0.2);
      const reasons = generateMatchReasons(skillMatch, locationMatch, experienceMatch);

      return {
        job_id: job.id,
        score,
        reasons
      };
    });

    // Mise à jour des scores dans la base de données
    const updates = jobMatches.map(match => 
      supabaseClient
        .from('scraped_jobs')
        .update({ match_score: Math.round(match.score * 100) })
        .eq('id', match.job_id)
    );

    await Promise.all(updates);

    return new Response(
      JSON.stringify({ data: jobMatches.sort((a, b) => b.score - a.score) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
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

function calculateSkillMatch(userSkills: string[], jobSkills: string[]): number {
  if (!userSkills.length || !jobSkills.length) return 0;
  const matchingSkills = userSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
  );
  return matchingSkills.length / Math.max(userSkills.length, jobSkills.length);
}

function calculateLocationMatch(preferredLocations: string[], jobLocation: string): number {
  if (!preferredLocations.length || !jobLocation) return 0;
  return preferredLocations.some(loc => 
    jobLocation.toLowerCase().includes(loc.toLowerCase())
  ) ? 1 : 0;
}

function calculateExperienceMatch(userLevel: string, jobLevel: string): number {
  if (!userLevel || !jobLevel) return 0.5;
  const levels = ['junior', 'mid-level', 'senior'];
  const userIdx = levels.indexOf(userLevel.toLowerCase());
  const jobIdx = levels.indexOf(jobLevel.toLowerCase());
  if (userIdx === -1 || jobIdx === -1) return 0.5;
  return 1 - Math.abs(userIdx - jobIdx) / levels.length;
}

function generateMatchReasons(skillMatch: number, locationMatch: number, experienceMatch: number): string[] {
  const reasons = [];
  if (skillMatch > 0.7) reasons.push("Vos compétences correspondent parfaitement");
  else if (skillMatch > 0.4) reasons.push("Certaines de vos compétences correspondent");
  if (locationMatch === 1) reasons.push("L'emplacement correspond à vos préférences");
  if (experienceMatch > 0.7) reasons.push("Votre niveau d'expérience correspond bien");
  return reasons;
}
