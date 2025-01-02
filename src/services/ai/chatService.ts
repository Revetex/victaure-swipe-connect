import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

interface Message {
  content: string;
  sender: string;
}

async function getHuggingFaceToken() {
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' },
    });

    if (error) throw error;
    return data.secret;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    throw new Error("Impossible de récupérer le token d'accès");
  }
}

async function generateAIResponse(messages: Message[]) {
  try {
    const token = await getHuggingFaceToken();
    
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        inputs: messages.map(m => `${m.sender}: ${m.content}`).join("\n"),
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Hugging Face:", errorText);
      throw new Error("Erreur de l'API Hugging Face: " + errorText);
    }

    const result = await response.json();
    return result[0].generated_text;
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse:", error);
    toast.error("Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.");
    throw error;
  }
}

async function saveMessage(userId: string, content: string, sender: string) {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .insert([{ user_id: userId, content, sender }]);

    if (error) throw error;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du message:", error);
    throw error;
  }
}

async function loadMessages(userId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    return [];
  }
}

export const chatService = {
  generateAIResponse,
  saveMessage,
  loadMessages,
};