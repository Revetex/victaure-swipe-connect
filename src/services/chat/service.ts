import { supabase } from "@/integrations/supabase/client";
import { Message } from "./types";
import { toast } from "sonner";

export async function loadMessages(): Promise<Message[]> {
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
    sender: msg.sender === "assistant" ? "assistant" : "user",
    timestamp: new Date(msg.created_at),
  }));
}

export async function saveMessage(message: Message): Promise<void> {
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
    toast.error("Erreur lors de la sauvegarde du message");
    throw error;
  }
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