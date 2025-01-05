import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { toast } from "sonner";
import { Message } from "@/types/chat/messageTypes";

async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('get_secret', {
        secret_name: 'HUGGING_FACE_API_KEY'
      });

    if (error) {
      console.error('Failed to retrieve API key:', error);
      throw new Error('Failed to retrieve API key');
    }

    // The RPC function returns a single row with a secret column
    if (!data || typeof data.secret !== 'string' || !data.secret) {
      console.error('No API key found in response:', data);
      throw new Error('No API key found');
    }

    return data.secret;
  } catch (error) {
    console.error('Error getting API key:', error);
    throw new Error('Failed to retrieve API key. Please check your configuration.');
  }
}

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const apiKey = await getHuggingFaceApiKey();
    
    if (!apiKey) {
      toast.error("Clé API manquante. Veuillez configurer la clé Hugging Face.");
      throw new Error('No API key available');
    }

    console.log('Sending request to Hugging Face API...');
    
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
            max_new_tokens: HUGGING_FACE_CONFIG.maxTokens,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      throw new Error(errorData.error || 'Failed to generate AI response');
    }

    const data = await response.json();
    
    if (!data || !data[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }
    
    return data[0].generated_text.trim();
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