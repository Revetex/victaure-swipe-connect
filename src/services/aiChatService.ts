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
        created_at: message.timestamp.toISOString() // Convert Date to ISO string
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
      sender: msg.sender as "user" | "assistant", // Type assertion to narrow the type
      timestamp: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
}

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', {
        secret_name: 'HUGGING_FACE_API_KEY'
      });

    if (secretError) {
      console.error("Error retrieving API key:", secretError);
      toast.error("Erreur lors de la récupération de la clé API");
      throw new Error("Could not retrieve the API token");
    }

    const apiKey = secretData[0]?.secret;
    if (!apiKey) {
      toast.error("La clé API Hugging Face n'est pas configurée");
      throw new Error("Hugging Face API key is not configured");
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    return result[0].generated_text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}