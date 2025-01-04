import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types/chat/messageTypes";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: messages, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map((msg): Message => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender as "user" | "assistant",
      timestamp: new Date(msg.created_at),
      created_at: msg.created_at
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
}

export async function saveMessage(message: Message) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        content: message.content,
        sender: message.sender,
        user_id: user.id,
        created_at: message.timestamp.toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any) {
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Impossible de récupérer le token API");
    }

    const apiKey = secretData;
    if (!apiKey) {
      throw new Error("La clé API Hugging Face n'est pas configurée");
    }

    const systemPrompt = `Tu es Mr. Victaure, un assistant virtuel professionnel et amical qui aide les utilisateurs à trouver du travail et à gérer leur carrière. 
    ${profile ? `L'utilisateur avec qui tu parles s'appelle ${profile.full_name}.` : ''}
    ${profile?.skills ? `Ses compétences principales sont: ${profile.skills.join(', ')}.` : ''}
    Réponds toujours en français de manière concise et pertinente.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<|im_start|>system
${systemPrompt}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant`,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Erreur lors de l'appel à l'API (${response.status})`);
    }

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0]?.generated_text;
      if (generatedText) {
        return generatedText.trim();
      }
    }

    throw new Error("Format de réponse invalide de l'API");
  } catch (error) {
    console.error("Error in AI response generation:", error);
    throw error;
  }
}