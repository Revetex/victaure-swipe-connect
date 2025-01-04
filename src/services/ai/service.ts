import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";

async function getHuggingFaceApiKey(): Promise<string> {
  const { data, error } = await supabase
    .rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

  if (error || !data?.secret) {
    throw new Error('Failed to retrieve API key');
  }

  return data.secret;
}

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const apiKey = await getHuggingFaceApiKey();
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_CONFIG.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    return data[0]?.generated_text || 'Je suis désolé, je ne peux pas répondre pour le moment.';
  } catch (error) {
    toast.error("Erreur lors de la génération de la réponse");
    throw error;
  }
}

export async function saveMessage(content: string, sender: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('ai_chat_messages')
    .insert({
      user_id: user.id,
      content,
      sender
    });

  if (error) {
    toast.error("Erreur lors de la sauvegarde du message");
    throw error;
  }
}

export async function loadMessages() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    toast.error("Erreur lors du chargement des messages");
    throw error;
  }

  return data;
}