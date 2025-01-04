import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { API_CONFIG } from "./config";
import { getHuggingFaceApiKey, buildPrompt } from "./utils";
import { handleApiResponse } from "./responseHandler";
import type { ChatPrompt } from "@/types/ai/chat";

export async function saveMessage(message: {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}) {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        content: message.content,
        sender: message.sender,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        created_at: message.timestamp.toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export async function deleteMessages(messageIds: string[]) {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .in('id', messageIds);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  console.log("Generating AI response for message:", message);
  
  try {
    const apiKey = await getHuggingFaceApiKey();
    const prompt = buildPrompt({ 
      context: profile ? `User profile - Name: ${profile.full_name}, Role: ${profile.role}` : undefined,
      message 
    });

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(API_CONFIG.endpoint, {
      headers: { 
        ...API_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (!error.message.includes("Model is loading") && 
        !error.message.includes("Invalid API key") &&
        !error.message.includes("Invalid response format")) {
      toast.error("Erreur lors de la génération de la réponse");
    }
    throw error;
  }
}