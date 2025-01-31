import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export class CommunicationAgent {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async handleUserInteraction(message: string, userId: string) {
    console.log("Communication Agent: Processing user interaction...");
    try {
      // Get user profile
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Check for specific actions in the message
      if (message.toLowerCase().includes('recherche') && message.toLowerCase().includes('mission')) {
        return await this.handleJobSearch(message, profile);
      }

      if (message.toLowerCase().includes('modifie') && message.toLowerCase().includes('profil')) {
        return await this.handleProfileUpdate(message, profile);
      }

      // Default response with career guidance
      return await this.generateCareerAdvice(message, profile);
    } catch (error) {
      console.error("Communication Agent error:", error);
      return {
        success: false,
        error: error.message,
        response: "Je m'excuse, une erreur est survenue. Pouvez-vous reformuler votre demande?"
      };
    }
  }

  private async handleJobSearch(message: string, profile: any) {
    const { data: jobs, error } = await this.supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .limit(5);

    if (error) throw error;

    const response = `J'ai trouvé ${jobs.length} missions qui pourraient vous intéresser. Voici les plus récentes :\n\n` +
      jobs.map((job: any) => `- ${job.title} chez ${job.company_name} à ${job.location}\n`).join('');

    return {
      success: true,
      response,
      jobs
    };
  }

  private async handleProfileUpdate(message: string, profile: any) {
    return {
      success: true,
      response: "Pour modifier votre profil, j'ai besoin de votre confirmation explicite. Quelles informations souhaitez-vous mettre à jour?"
    };
  }

  private async generateCareerAdvice(message: string, profile: any) {
    const response = `Je comprends votre situation. En tant qu'expert en orientation professionnelle au Québec, voici mes conseils personnalisés basés sur votre profil actuel et le marché local.`;

    return {
      success: true,
      response
    };
  }
}