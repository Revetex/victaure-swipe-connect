import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { toast } from "sonner";

// Types for API responses
interface HuggingFaceResponse {
  generated_text?: string;
}

// Constants
const API_ENDPOINT = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Database operations
export async function saveMessage(message: Message) {
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

export async function loadMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender as "user" | "assistant",
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
}

// Helper function to validate API key format
function validateApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.startsWith('hf_') && apiKey.length > 3;
}

// Helper function to get API key from Supabase
async function getHuggingFaceApiKey(): Promise<string> {
  const { data: secretData, error: secretError } = await supabase
    .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

  if (secretError || !secretData || !Array.isArray(secretData) || secretData.length === 0) {
    console.error("Error retrieving API key:", secretError);
    toast.error("Erreur lors de la récupération de la clé API");
    throw new Error("Could not retrieve the API token");
  }

  const apiKey = secretData[0]?.secret;
  
  if (!apiKey || !validateApiKey(apiKey)) {
    console.error("Invalid API key format");
    toast.error("Format de la clé API invalide. La clé doit commencer par 'hf_'");
    throw new Error("Invalid API key format");
  }

  return apiKey;
}

// Helper function to handle API response
async function handleApiResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API Error Response:", errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.includes("token seems invalid")) {
        toast.error("La clé API Hugging Face n'est pas valide. Veuillez vérifier votre clé.");
        throw new Error("Invalid Hugging Face API token");
      }
    } catch (e) {
      if (response.status === 503) {
        toast.error("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants");
        throw new Error("Model is loading");
      } else if (response.status === 401 || response.status === 400) {
        toast.error("La clé API n'est pas valide");
        throw new Error("Invalid API key");
      }
      toast.error("Erreur lors de la génération de la réponse");
      throw new Error(`API request failed: ${errorText}`);
    }
  }

  const responseClone = response.clone();
  
  try {
    const result = await response.json();
    console.log("API Response:", result);

    if (Array.isArray(result) && result.length > 0 && result[0]?.generated_text) {
      return result[0].generated_text.trim();
    } 
    
    if (result.generated_text) {
      return result.generated_text.trim();
    }

    const textResponse = await responseClone.text();
    if (textResponse) {
      return textResponse.trim();
    }

    console.error("Unexpected API response format:", result);
    toast.error("Format de réponse invalide");
    throw new Error("Invalid response format from API");
  } catch (parseError) {
    console.error("Error parsing JSON response:", parseError);
    const textResponse = await responseClone.text();
    if (textResponse) {
      return textResponse.trim();
    }
    throw parseError;
  }
}

// Main function to generate AI response
export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  console.log("Generating AI response for message:", message);
  
  try {
    const apiKey = await getHuggingFaceApiKey();
    const contextPrompt = profile ? 
      `Context: User profile - Name: ${profile.full_name}, Role: ${profile.role}\n` : '';

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(API_ENDPOINT, {
      headers: { 
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `<|im_start|>system
You are Mr. Victaure, a professional and friendly AI assistant. You help users with their job search and career development. Always respond in French.
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