import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage } from "../types/chatTypes";

export async function saveMessage(message: ChatMessage): Promise<void> {
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

export async function loadMessages(): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading messages:", error);
    throw error;
  }

  return data.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender,
    timestamp: new Date(msg.created_at),
  }));
}