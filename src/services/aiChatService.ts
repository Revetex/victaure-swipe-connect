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
    // First, get the API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError) {
      console.error("Error fetching API token:", secretError);
      throw new Error("Could not retrieve the API token. Please make sure it's properly configured in Supabase.");
    }

    const apiKey = secretData;
    if (!apiKey) {
      throw new Error("Hugging Face API key is not configured. Please set it up in your Supabase settings.");
    }

    console.log("Making request to Hugging Face API...");

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
You are Mr. Victaure, a professional and friendly AI assistant who helps users with their job search and career development. Always respond in French.
${profile ? `The user you're talking to is ${profile.full_name}.` : ''}
${profile?.skills ? `Their main skills are: ${profile.skills.join(', ')}.` : ''}
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
      console.error("Hugging Face API Error Response:", errorText);
      
      if (response.status === 400 && errorText.includes("Authorization")) {
        toast.error("Le token d'API semble invalide. Veuillez vérifier votre configuration.");
        throw new Error("Invalid API token. Please check your configuration.");
      }
      
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0]?.generated_text;
      if (generatedText) {
        return generatedText.trim();
      }
    }

    throw new Error("Invalid response format from API");

  } catch (error) {
    console.error("Error generating AI response:", error);
    toast.error("Erreur lors de la génération de la réponse");
    throw error;
  }
}