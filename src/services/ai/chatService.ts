import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config/huggingFaceConfig";
import { validateApiKey, validateApiResponse } from "./utils/apiValidator";
import { handleChatError } from "./utils/errorHandler";
import type { ChatContext, ApiResponse, Message } from "./types/chatTypes";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (error) {
      console.error("Error retrieving API key:", error);
      throw new Error("Could not retrieve the API token");
    }

    if (!data || !data[0]?.secret) {
      throw new Error("API key not found. Please configure your Hugging Face API key in the project settings.");
    }

    return data[0].secret;
  } catch (error) {
    console.error("Error in getHuggingFaceApiKey:", error);
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading messages:", error);
    throw error;
  }

  return data.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender === "assistant" ? "assistant" : "user" as const,
    timestamp: new Date(msg.created_at),
  }));
}

export async function saveMessage(message: Message): Promise<void> {
  const { error } = await supabase
    .from('ai_chat_messages')
    .insert({
      id: message.id,
      content: message.content,
      sender: message.sender,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      created_at: message.timestamp.toISOString()
    });

  if (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function deleteMessages(messageIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('ai_chat_messages')
    .delete()
    .in('id', messageIds);

  if (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  try {
    const apiKey = await getHuggingFaceApiKey();
    if (!apiKey) {
      throw new Error("API key not configured");
    }

    validateApiKey(apiKey);

    const prompt = `<|im_start|>system\n${SYSTEM_PROMPT}\n${profile ? `Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : ''}<|im_end|>\n<|im_start|>user\n${message}\n<|im_end|>\n<|im_start|>assistant\n`;

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(HUGGING_FACE_CONFIG.endpoint, {
      headers: { 
        ...HUGGING_FACE_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: HUGGING_FACE_CONFIG.modelParams
      }),
    });

    console.log("Response status:", response.status);
    validateApiResponse(response);

    const result = await response.json() as ApiResponse;
    console.log("API Response:", result);
    
    if (!result.generated_text) {
      throw new Error("Invalid response format from API");
    }

    return result.generated_text.trim();
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    return handleChatError(error);
  }
}