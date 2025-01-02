import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

export const chatService = {
  async loadMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      throw error;
    }

    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender as "user" | "assistant",
      timestamp: new Date(msg.created_at),
    }));
  },

  async saveMessage(userId: string, content: string, sender: "user" | "assistant"): Promise<void> {
    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: uuidv4(),
        user_id: userId,
        content,
        sender,
      });

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

  async generateAIResponse(message: string): Promise<string> {
    try {
      console.log("Fetching API token...");
      const { data: secretData, error: secretError } = await supabase
        .rpc('get_secret', { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' });
      
      if (secretError || !secretData) {
        console.error("Error fetching API token:", secretError);
        throw new Error("Échec de la récupération du token API");
      }

      const API_TOKEN = secretData;
      
      console.log("Sending request to Hugging Face API...");
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_TOKEN}`
          },
          body: JSON.stringify({
            inputs: `<|im_start|>system
Tu es M. Victaure, un assistant professionnel et amical qui aide les utilisateurs dans leur recherche d'emploi et leur développement de carrière. Tu dois TOUJOURS répondre en français de manière professionnelle mais chaleureuse.
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant
`,
            parameters: {
              max_new_tokens: 1024,
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true,
              return_full_text: false
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API Error:", errorText);
        throw new Error("Erreur de l'API Hugging Face: " + errorText);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (Array.isArray(result) && result.length > 0) {
        const generatedText = result[0]?.generated_text;
        if (generatedText) {
          return generatedText.trim();
        }
      }

      throw new Error("Format de réponse API invalide");

    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  },
};