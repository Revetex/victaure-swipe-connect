import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";

async function getHuggingFaceApiKey(): Promise<string> {
  const { data, error } = await supabase
    .rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

  if (error || !data) {
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
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function saveMessage(message: Message): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('ai_chat_messages')
    .insert({
      id: message.id,
      user_id: user.id,
      content: message.content,
      sender: message.sender,
      created_at: message.timestamp.toISOString()
    });

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

export async function loadMessages(): Promise<Message[]> {
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
    console.error('Error loading messages:', error);
    throw error;
  }

  return data.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender,
    timestamp: new Date(msg.created_at),
    created_at: msg.created_at,
    updated_at: msg.updated_at,
    user_id: msg.user_id
  }));
}

export async function deleteAllMessages(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('ai_chat_messages')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
}