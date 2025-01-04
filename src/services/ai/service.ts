import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import type { ApiResponse } from "./types";
import { toast } from "sonner";

async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'HUGGING_FACE_API_KEY' }
    });

    if (error || !data?.secret) {
      throw new Error('Failed to retrieve API key');
    }

    return data.secret;
  } catch (error) {
    console.error('Error in getHuggingFaceApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  try {
    const apiKey = await getHuggingFaceApiKey();
    
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const prompt = `${SYSTEM_PROMPT}\n\nUtilisateur: ${message}\n\nAssistant:`;

    const response = await fetch(HUGGING_FACE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        ...HUGGING_FACE_CONFIG.defaultHeaders,
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        ...HUGGING_FACE_CONFIG.modelParams,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json() as ApiResponse[];
    
    if (!Array.isArray(result) || !result[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }

    return result[0].generated_text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    toast.error("Erreur lors de la génération de la réponse");
    throw error;
  }
}

// Messages CRUD operations
export async function saveMessage(message: any): Promise<void> {
  const { error } = await supabase
    .from('ai_chat_messages')
    .insert(message);

  if (error) {
    console.error("Error saving message:", error);
    toast.error("Erreur lors de la sauvegarde du message");
    throw error;
  }
}

export async function loadMessages(): Promise<any[]> {
  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading messages:", error);
    toast.error("Erreur lors du chargement des messages");
    throw error;
  }

  return data;
}

export async function deleteMessages(messageIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('ai_chat_messages')
    .delete()
    .in('id', messageIds);

  if (error) {
    console.error("Error deleting messages:", error);
    toast.error("Erreur lors de la suppression des messages");
    throw error;
  }
}