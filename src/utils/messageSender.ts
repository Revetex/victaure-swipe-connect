
import { supabase } from '@/integrations/supabase/client';
import { Message, Receiver, DatabaseMessage, transformDatabaseMessage } from '@/types/messages';
import { UserProfile } from '@/types/profile';
import { Json } from '@/types/database/auth';

export const sendMessage = async (
  message: string,
  receiver: Receiver,
  profile: UserProfile
): Promise<Message | null> => {
  const newMessage = {
    content: message,
    sender_id: profile.id,
    receiver_id: receiver.id,
    message_type: receiver.id === 'assistant' ? 'assistant' : 'user',
    is_assistant: receiver.id === 'assistant',
    status: 'sent',
    metadata: {
      device: 'web',
      timestamp: new Date().toISOString()
    } as Record<string, Json>
  };

  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert(newMessage)
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(*),
      receiver:profiles!messages_receiver_id_fkey(*)
    `)
    .single();

  if (messageError) throw messageError;

  if (messageData) {
    const notification = {
      user_id: receiver.id,
      title: "Nouveau message",
      message: `${profile.full_name} vous a envoyé : ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
      type: 'message'
    };

    await supabase
      .from('notifications')
      .insert(notification)
      .throwOnError();

    return transformDatabaseMessage(messageData as DatabaseMessage);
  }

  return null;
};
