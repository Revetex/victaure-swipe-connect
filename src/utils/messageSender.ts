
import { supabase } from '@/integrations/supabase/client';
import { Message, Receiver } from '@/types/messages';
import { Profile } from '@/types/profile';

export const sendMessage = async (
  message: string,
  receiver: Receiver,
  profile: Profile
): Promise<Message | null> => {
  const newMessage = {
    content: message,
    sender_id: profile.id,
    receiver_id: receiver.id,
    message_type: 'user',
    read: false,
    status: 'sent',
    metadata: {
      device: 'web',
      timestamp: new Date().toISOString()
    }
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

  const notification = {
    user_id: receiver.id,
    title: "Nouveau message",
    message: `${profile.full_name} vous a envoyé : ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
    type: 'message'
  };

  const { error: notificationError } = await supabase
    .from('notifications')
    .insert(notification);

  if (notificationError) {
    console.error('Erreur notification:', notificationError);
  }

  if (messageData) {
    return {
      ...messageData,
      timestamp: messageData.created_at,
      status: 'sent',
      message_type: 'user',
      metadata: messageData.metadata as Record<string, any> || {},
      sender: messageData.sender || {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url || '/placeholder.svg',
        online_status: true,
        last_seen: new Date().toISOString()
      },
      receiver: messageData.receiver || receiver
    };
  }

  return null;
};
