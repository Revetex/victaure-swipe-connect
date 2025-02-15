
import { useState, useCallback } from 'react';
import { Message, Receiver, transformDatabaseMessage } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMessagesStore } from '@/store/messagesStore';

export function usePrivateChat(receiver: Receiver) {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { addMessage } = useMessagesStore();

  const sendPrivateMessage = useCallback(async (content: string) => {
    if (!content.trim() || !profile) {
      toast.error("Message invalide ou utilisateur non connecté");
      return;
    }

    setIsLoading(true);
    try {
      const newMessage = {
        content,
        sender_id: profile.id,
        receiver_id: receiver.id,
        message_type: 'user' as const,
        status: 'sent' as const,
        metadata: {
          type: 'private_message',
          timestamp: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (error) throw error;

      if (data) {
        const transformedMessage = transformDatabaseMessage(data);
        addMessage(transformedMessage);
      }
    } catch (error) {
      console.error('Error sending private message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [profile, receiver, addMessage]);

  return {
    sendPrivateMessage,
    isLoading
  };
}
