import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export class CommunicationAgent {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async handleUserInteraction(message: string, userId: string) {
    console.log("Communication Agent: Processing user interaction...");
    try {
      const response = await this.generateResponse(message);
      await this.saveInteraction(userId, message, response);
      return { success: true, response };
    } catch (error) {
      console.error("Communication Agent error:", error);
      return { success: false, error: error.message };
    }
  }

  private async generateResponse(message: string) {
    // Implement response generation logic
    return "I understand your message and I'm working on it.";
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