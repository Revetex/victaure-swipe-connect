
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";

export const saveMessage = async (message: Message) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        sender_id: user.id,
        receiver_id: user.id,
        content: message.content,
        is_assistant: message.sender_id === 'assistant',
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
      .from('messages')
      .delete()
      .eq('receiver_id', user.id)
      .eq('is_assistant', true);

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
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .eq('is_assistant', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.is_assistant ? 'assistant' : 'user',
      timestamp: msg.created_at,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender_id: msg.is_assistant ? 'assistant' : user.id,
      receiver_id: user.id,
      read: msg.read
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
