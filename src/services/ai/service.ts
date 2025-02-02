import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";

export const saveMessage = async (message: Message) => {
  try {
    const { error } = await supabase
      .from('ai_chat_messages')
      .insert({
        id: message.id,
        user_id: message.sender_id === 'assistant' ? message.receiver_id : message.sender_id,
        content: message.content,
        sender: message.sender,
        created_at: message.created_at,
        updated_at: message.updated_at
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

export const deleteAllMessages = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
};

export const loadMessages = async (): Promise<Message[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: messages, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.created_at),
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender_id: msg.sender || user.id,
      receiver_id: msg.receiver || 'assistant',
      read: msg.read || false
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
};

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};