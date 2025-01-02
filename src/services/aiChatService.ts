import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { toast } from "sonner";

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  try {
    console.log("Fetching API token...");
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' });
    
    if (secretError || !secretData) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Échec de la récupération du token API");
    }

    const API_TOKEN = secretData;
    const contextPrompt = profile ? 
      `Contexte: Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : '';
    
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
${contextPrompt}
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
      throw new Error(errorText);
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
}

export async function saveMessage(message: Message): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        content: message.content,
        sender: message.sender,
        user_id: user.id,
        created_at: message.timestamp.toISOString(),
      });

    if (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur dans saveMessage:', error);
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors du chargement des messages:', error);
      return [];
    }

    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender as "user" | "assistant",
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error('Erreur dans loadMessages:', error);
    return [];
  }
}
