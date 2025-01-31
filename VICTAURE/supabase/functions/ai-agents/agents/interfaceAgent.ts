import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export class InterfaceAgent {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async matchJobsToClients() {
    console.log("Interface Agent: Starting job matching...");
    try {
      const { data: jobs, error: jobsError } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open');

      if (jobsError) throw jobsError;

      const { data: profiles, error: profilesError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional');

      if (profilesError) throw profilesError;

      const matches = await this.calculateMatches(jobs, profiles);
      await this.saveMatches(matches);

      return { success: true, message: "Matches created successfully" };
    } catch (error) {
      console.error("Interface Agent error:", error);
      return { success: false, error: error.message };
    }
  }

  private async calculateMatches(jobs: any[], profiles: any[]) {
    const matches = [];
    
    for (const job of jobs) {
      for (const profile of profiles) {
        const score = this.calculateMatchScore(job, profile);
        if (score > 0.5) { // Minimum match threshold
          matches.push({
            job_id: job.id,
            professional_id: profile.id,
            employer_id: job.employer_id,
            match_score: score
          });
        }
      }
    }

    return matches;
  }

  private calculateMatchScore(job: any, profile: any) {
    let score = 0;
    const weights = {
      skills: 0.5,
      location: 0.3,
      experience: 0.2
    };

    // Skills match
    if (job.required_skills && profile.skills) {
      const matchingSkills = job.required_skills.filter((skill: string) => 
        profile.skills.includes(skill)
      );
      score += (matchingSkills.length / job.required_skills.length) * weights.skills;
    }

    // Location match
    if (job.location && profile.city) {
      if (job.location.toLowerCase().includes(profile.city.toLowerCase())) {
        score += weights.location;
      }
    }

    // Experience match (simplified)
    if (job.years_of_experience && profile.experiences) {
      const totalExperience = profile.experiences.length; // Simplified calculation
      if (totalExperience >= job.years_of_experience) {
        score += weights.experience;
      }
    }

    return score;
  }

  private async saveMatches(matches: any[]) {
    for (const match of matches) {
      const { error } = await this.supabase
        .from('matches')
        .upsert(match);

      if (error) {
        console.error("Error saving match:", error);
        throw error;
      }
    }
  }
}