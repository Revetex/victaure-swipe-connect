<lov-code>
import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config/huggingFaceConfig";
import { validateApiKey, validateApiResponse } from "./utils/apiValidator";
import { handleChatError } from "./utils/errorHandler";
import type { ChatContext, ApiResponse, Message } from "./types/chatTypes";

export async function getHuggingFaceApiKey(): Promise<string> {
  const { data: secretData, error } = await supabase
    .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

  if (error || !secretData) {
    throw new Error("Could not retrieve the API token");
  }

  // Extract the secret string from the response
  const secret = Array.isArray(secretData) && secretData[0]?.secret;
  if (!secret) {
    throw new Error("Invalid secret format");
  }

  return secret;
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
    validateApiKey(apiKey);

    const prompt = `<|im_start|>system\n${SYSTEM_PROMPT}\n${profile ? `User profile - Name: ${profile.full_name}, Role: ${profile.role}\n` : ''}