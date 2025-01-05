import { SupabaseClient } from "@supabase/supabase-js";

export async function handleProfileAnalysis(profile: any, supabase: SupabaseClient) {
  const analysis = await analyzeUserProfile(profile, supabase);
  
  return {
    message: "Voici l'analyse de votre profil professionnel",
    analysis,
    suggestedActions: [
      {
        type: 'navigate_to_profile',
        label: 'Mettre à jour mon profil',
        icon: 'user'
      }
    ]
  };
}

async function analyzeUserProfile(profile: any, supabase: SupabaseClient) {
  const recommendations = {
    skills: [] as string[],
    certifications: [] as string[],
    jobTypes: [] as string[],
    suggestions: [] as string[]
  };

  if (!profile.skills?.length) {
    recommendations.suggestions.push("Ajoutez vos compétences pour augmenter vos chances de match");
  }

  if (!profile.experiences?.length) {
    recommendations.suggestions.push("Ajoutez vos expériences professionnelles");
  }

  const { data: trendingSkills } = await supabase
    .from('jobs')
    .select('required_skills')
    .not('required_skills', 'is', null);

  const skillFrequency = new Map();
  trendingSkills?.forEach((job: any) => {
    job.required_skills?.forEach((skill: string) => {
      skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
    });
  });

  const userSkills = new Set(profile.skills || []);
  const topSkills = Array.from(skillFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill)
    .filter(skill => !userSkills.has(skill));

  recommendations.skills = topSkills;

  return recommendations;
}