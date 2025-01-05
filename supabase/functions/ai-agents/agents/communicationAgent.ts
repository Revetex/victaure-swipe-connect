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
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Generate contextual response based on profile and message
      const response = await this.generateResponse(message, profile);
      
      // Save interaction
      await this.saveInteraction(userId, message, response);
      
      return { success: true, response };
    } catch (error) {
      console.error("Communication Agent error:", error);
      return { success: false, error: error.message };
    }
  }

  private async generateResponse(message: string, profile: any) {
    try {
      const context = this.buildContext(profile);
      const response = await this.callHuggingFace(message, context);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "Je m'excuse, j'ai rencontré une difficulté. Pourriez-vous reformuler votre demande?";
    }
  }

  private buildContext(profile: any) {
    return {
      role: profile?.role || 'professional',
      skills: profile?.skills?.join(', ') || 'non spécifiées',
      location: `${profile?.city || 'non spécifiée'}, ${profile?.state || 'Québec'}, ${profile?.country || 'Canada'}`,
      experience: profile?.experiences || [],
      education: profile?.education || [],
      certifications: profile?.certifications || []
    };
  }

  private async callHuggingFace(message: string, context: any) {
    // Implement the actual call to Hugging Face here
    // This is where you would use the HUGGING_FACE_CONFIG from config.ts
    return "Je comprends votre demande. Pour mieux vous aider, j'aimerais en savoir plus sur vos objectifs professionnels.";
  }

  private async saveInteraction(userId: string, message: string, response: string) {
    const { error } = await this.supabase
      .from('ai_chat_messages')
      .insert([
        {
          user_id: userId,
          content: message,
          sender: 'user'
        },
        {
          user_id: userId,
          content: response,
          sender: 'assistant'
        }
      ]);

    if (error) {
      console.error("Error saving interaction:", error);
      throw error;
    }
  }
}