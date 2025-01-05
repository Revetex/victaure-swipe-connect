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
    const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY is not set');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Tu es M. Victaure, un assistant virtuel spécialisé en placement et recherche d'emploi au Québec. 
          Tu dois répondre en français québécois de manière naturelle et authentique.
          
          Message de l'utilisateur: ${message}
          
          Ta réponse:`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    return data[0].generated_text.trim();
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