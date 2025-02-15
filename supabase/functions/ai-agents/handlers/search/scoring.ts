
export function findMatchingKeywords(job: any, keywords: string[]): string[] {
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  return keywords.filter(keyword => jobText.includes(keyword.toLowerCase()));
}

export function calculateRelevanceScore(job: any, keywords: string[], profile: any): number {
  let score = 0;
  
  const matchedKeywords = findMatchingKeywords(job, keywords);
  score += matchedKeywords.length * 2;
  
  if (job.required_skills && profile?.skills) {
    const matchingSkills = job.required_skills.filter((skill: string) => 
      profile.skills.includes(skill)
    );
    score += matchingSkills.length;
  }
  
  if (job.experience_level === profile?.experience_level) {
    score += 2;
  }
  
  if (profile?.city && job.location?.toLowerCase().includes(profile.city.toLowerCase())) {
    score += 3;
  }
  
  return score;
}

export function calculateSkillMatchPercentage(job: any, profile: any): number {
  if (!job.required_skills || !profile.skills) return 0;
  
  const matchingSkills = job.required_skills.filter((skill: string) => 
    profile.skills.includes(skill)
  );
  
  return (matchingSkills.length / job.required_skills.length) * 100;
}

export function calculateAverageSkillMatch(jobs: any[]): number {
  const matches = jobs.map(j => j.skill_match_percentage);
  return matches.reduce((a, b) => a + b, 0) / matches.length;
}

export function getTopMatchedKeywords(jobs: any[]): string[] {
  const keywordCounts = new Map<string, number>();
  
  jobs.forEach(job => {
    job.matched_keywords.forEach((keyword: string) => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });
  
  return Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword);
}
