import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";
import { toast } from "sonner";

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

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  console.log("Generating AI response for message:", message);
  
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError || !secretData) {
      console.error("Error retrieving API key:", secretError);
      toast.error("Erreur lors de la récupération de la clé API");
      throw new Error("Could not retrieve the API token");
    }

    console.log("Successfully retrieved API key");
    const apiKey = secretData;
    
    if (!apiKey) {
      console.error("API key is empty or undefined");
      toast.error("La clé API Hugging Face n'est pas configurée");
      throw new Error("Hugging Face API key is not configured");
    }

    const contextPrompt = profile ? 
      `Context: User profile - Name: ${profile.full_name}, Role: ${profile.role}\n` : '';

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error Response:", errorText);
      
      if (response.status === 503) {
        toast.error("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants");
        throw new Error("Model is loading");
      } else if (response.status === 401) {
        toast.error("La clé API n'est pas valide");
        throw new Error("Invalid API key");
      } else {
        toast.error("Erreur lors de la génération de la réponse");
        throw new Error(`API request failed: ${errorText}`);
      }
    }

    // Clone the response before reading it
    const responseClone = response.clone();
    
    try {
      console.log("Received response from API");
      const result = await response.json();
      console.log("API Response:", result);

      // Handle both array and object response formats
      if (Array.isArray(result) && result.length > 0) {
        const generatedText = result[0]?.generated_text;
        if (generatedText) {
          return generatedText.trim();
        }
      } else if (result.generated_text) {
        // Some models return the response directly in the object
        return result.generated_text.trim();
      }

      // If we get here, try parsing the response as text
      const textResponse = await responseClone.text();
      if (textResponse) {
        return textResponse.trim();
      }

      console.error("Unexpected API response format:", result);
      toast.error("Format de réponse invalide");
      throw new Error("Invalid response format from API");
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Try to get the response as text instead
      const textResponse = await responseClone.text();
      if (textResponse) {
        return textResponse.trim();
      }
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    // Only show toast if it's not already handled
    if (!error.message.includes("Model is loading") && 
        !error.message.includes("Invalid API key") &&
        !error.message.includes("Invalid response format")) {
      toast.error("Erreur lors de la génération de la réponse");
    }
    throw error;
  }
}