import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config/huggingFaceConfig";
import { validateApiKey, validateApiResponse } from "./utils/apiValidator";
import { handleChatError } from "./utils/errorHandler";
import type { ChatContext, ApiResponse, Message } from "./types/chatTypes";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    console.log("Fetching Hugging Face API key...");
    const { data, error } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (error) {
      console.error("Error retrieving API key:", error);
      throw new Error("Could not retrieve the API token");
    }

    if (!data || data.length === 0 || !data[0]?.secret) {
      console.error("API key not found in response:", data);
      throw new Error("API key not found. Please configure your Hugging Face API key in the project settings.");
    }

    console.log("API key retrieved successfully");
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
    console.log("Starting AI response generation...");
    const apiKey = await getHuggingFaceApiKey();
    
    if (!apiKey) {
      console.error("No API key returned");
      throw new Error("API key not configured");
    }

    validateApiKey(apiKey);

    const prompt = `<|im_start|>system
${SYSTEM_PROMPT}
${profile ? `Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : ''}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant
`;

    console.log("Sending request to Hugging Face API...");
    console.log("Using endpoint:", HUGGING_FACE_CONFIG.endpoint);
    
    const response = await fetch(HUGGING_FACE_CONFIG.endpoint, {
      method: "POST",
      headers: { 
        ...HUGGING_FACE_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: HUGGING_FACE_CONFIG.modelParams
      }),
    });

    console.log("Response status:", response.status);
    await validateApiResponse(response);

    const result = await response.json();
    console.log("Raw API Response:", result);
    
    if (Array.isArray(result) && result.length > 0 && result[0]?.generated_text) {
      return result[0].generated_text.trim();
    } 
    
    if (result.generated_text) {
      return result.generated_text.trim();
    }

    console.error("Unexpected API response format:", result);
    throw new Error("Format de réponse invalide");
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    return handleChatError(error);
  }
}