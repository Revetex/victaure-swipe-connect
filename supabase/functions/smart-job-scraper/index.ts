
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Your deployment's URL provided by Supabase
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

    console.log(`Analyzing ${jobs.length} jobs for profile match`);

    // 3. Utiliser Gemini pour analyser la correspondance
    const matches: JobMatch[] = await analyzeJobsWithGemini(profile, jobs);

    // 4. Mettre à jour les scores de correspondance dans la base de données
    for (const match of matches) {
      await supabase
        .from('scraped_jobs')
        .update({ match_score: match.score })
        .eq('id', match.job_id);
    }

    return new Response(JSON.stringify(matches), {
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

async function analyzeJobsWithGemini(profile: any, jobs: any[]): Promise<JobMatch[]> {
  const systemPrompt = `En tant qu'expert en recrutement, analysez la compatibilité entre le profil du candidat et les offres d'emploi. 
  Basez votre analyse sur :
  - Les compétences techniques requises vs acquises
  - L'expérience professionnelle
  - La localisation
  - Le type de contrat
  - Le niveau d'expérience
  
  Pour chaque offre, retournez :
  - Un score de compatibilité de 0 à 100
  - Les raisons principales de la compatibilité ou incompatibilité`;

  const messages = [{
    role: "user",
    content: `Profil du candidat : ${JSON.stringify(profile, null, 2)}
    
    Offres d'emploi à analyser : ${JSON.stringify(jobs, null, 2)}
    
    Analysez la compatibilité et retournez un tableau JSON avec les scores et raisons pour chaque offre.`
  }];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": supabaseUrl,
        "X-Title": "Job Matching Analysis"
      },
      body: JSON.stringify({
        model: "google/gemini-pro",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    console.log('Gemini response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Gemini');
    }

    // Parser la réponse en JSON
    const analysisResult = JSON.parse(data.choices[0].message.content);
    
    return jobs.map((job: any, index: number) => ({
      job_id: job.id,
      score: analysisResult[index].score,
      reasons: analysisResult[index].reasons
    }));

  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    throw error;
  }
}
