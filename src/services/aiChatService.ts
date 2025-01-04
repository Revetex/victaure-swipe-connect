import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types/chat/messageTypes";

export async function loadMessages() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: messages, error } = await supabase
      .from("ai_chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return messages.map((msg): Message => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
}

export async function saveMessage(message: {
  id: string;
  content: string;
  sender: string;
  created_at: Date;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("ai_chat_messages").insert({
      id: message.id,
      content: message.content,
      sender: message.sender,
      user_id: user.id,
      created_at: message.created_at,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any) {
  try {
    console.log("Generating AI response...");

    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Impossible de récupérer le token API. Veuillez configurer votre clé API Hugging Face dans les paramètres.");
    }

    const apiKey = secretData?.[0]?.secret || '';
    if (!apiKey.trim()) {
      throw new Error("La clé API Hugging Face n'est pas configurée. Veuillez l'ajouter dans les paramètres.");
    }

    const systemPrompt = `Tu es un assistant virtuel professionnel et amical qui aide les utilisateurs à trouver du travail et à gérer leur carrière. 
    ${profile ? `L'utilisateur avec qui tu parles s'appelle ${profile.full_name}.` : ''}
    ${profile?.skills ? `Ses compétences principales sont: ${profile.skills.join(', ')}.` : ''}
    Réponds de manière concise et pertinente.`;

    const userMessage = message?.trim() || '';
    if (!userMessage) {
      throw new Error("Le message ne peut pas être vide");
    }

    const prompt = `<s>[INST] ${systemPrompt}

    Message de l'utilisateur: ${userMessage} [/INST]</s>`;

    console.log("Sending request to API with prompt:", prompt);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
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
      
      if (response.status === 401 || response.status === 403) {
        throw new Error("Clé API invalide. Veuillez vérifier votre configuration.");
      }
      
      throw new Error(
        `Erreur lors de l'appel à l'API (${response.status}): ${errorText}`
      );
    }

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parsing API response:", e);
      throw new Error("Format de réponse invalide de l'API");
    }

    console.log("API Response:", result);

    if (!result || !Array.isArray(result) || !result[0]?.generated_text) {
      throw new Error("Format de réponse invalide de l'API");
    }

    return result[0].generated_text.trim();
  } catch (error) {
    console.error("Error in AI response generation:", error);
    throw error;
  }
}