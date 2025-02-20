
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Votre URL et clé de service Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface JobMatch {
  job_id: string;
  score: number;
  reasons: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    console.log('Analyzing jobs for user:', user_id);

    // 1. Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) throw profileError;

    // 2. Récupérer les emplois récents
    const { data: jobs, error: jobsError } = await supabase
      .from('scraped_jobs')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(50);

    if (jobsError) throw jobsError;

    console.log(`Analyzing ${jobs?.length || 0} jobs for profile match`);

    // Initialiser le tableau de correspondances
    const matches: JobMatch[] = [];

    // Analyser chaque emploi
    for (const job of jobs || []) {
      const score = calculateJobScore(job, profile);
      matches.push({
        job_id: job.id,
        score,
        reasons: generateMatchReasons(job, profile, score)
      });
    }

    // 4. Mettre à jour les scores de correspondance dans la base de données
    for (const match of matches) {
      await supabase
        .from('scraped_jobs')
        .update({ match_score: match.score })
        .eq('id', match.job_id);
    }

    return new Response(JSON.stringify({ data: matches }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart-job-scraper:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateJobScore(job: any, profile: any): number {
  let score = 0;

  // Vérifier les compétences
  if (profile.skills && job.skills) {
    const profileSkills = profile.skills.map((s: string) => s.toLowerCase());
    const jobSkills = job.skills.map((s: string) => s.toLowerCase());
    const matchingSkills = profileSkills.filter((skill: string) => jobSkills.includes(skill));
    score += (matchingSkills.length / jobSkills.length) * 50;
  }

  // Vérifier la localisation
  if (profile.city && job.location) {
    if (job.location.toLowerCase().includes(profile.city.toLowerCase())) {
      score += 25;
    }
  }

  // Vérifier le type de contrat
  if (profile.preferred_work_type && job.contract_type) {
    if (job.contract_type.toLowerCase() === profile.preferred_work_type.toLowerCase()) {
      score += 25;
    }
  }

  return Math.min(100, score);
}

function generateMatchReasons(job: any, profile: any, score: number): string[] {
  const reasons: string[] = [];

  if (score >= 75) {
    reasons.push("Excellente correspondance avec votre profil");
  } else if (score >= 50) {
    reasons.push("Bonne correspondance avec vos compétences");
  } else {
    reasons.push("Quelques compétences correspondent à votre profil");
  }

  if (profile.city && job.location) {
    if (job.location.toLowerCase().includes(profile.city.toLowerCase())) {
      reasons.push("Localisation correspondant à vos préférences");
    }
  }

  if (profile.preferred_work_type && job.contract_type) {
    if (job.contract_type.toLowerCase() === profile.preferred_work_type.toLowerCase()) {
      reasons.push("Type de contrat correspondant à vos préférences");
    }
  }

  return reasons;
}
