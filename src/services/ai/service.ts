
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat/messageTypes";

export const saveMessage = async (message: Message) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('messages')
      .insert({
        content: message.content,
        sender_id: user.id,
        receiver_id: user.id,
        message_type: message.sender_id === 'assistant' ? 'ai' : 'user',
        created_at: message.created_at,
        updated_at: message.updated_at,
        read: false,
        metadata: {}
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
      .eq('sender_id', user.id);

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
      .eq('sender_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.message_type === 'ai' ? {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      } : {
        id: user.id,
        full_name: user.user_metadata.full_name || 'User',
        avatar_url: user.user_metadata.avatar_url,
        online_status: true,
        last_seen: new Date().toISOString()
      },
      timestamp: msg.created_at,
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender_id: msg.message_type === 'ai' ? 'assistant' : user.id,
      receiver_id: user.id,
      read: true
    }));
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
};
