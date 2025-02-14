
import { useState, useCallback } from 'react';
import { Message, Receiver } from '@/types/messages';
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
        message_type: 'user',
        status: 'sent',
        metadata: {
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
        addMessage({
          ...data,
          timestamp: data.created_at,
          status: 'sent',
          message_type: 'user',
          metadata: data.metadata || {},
          sender: data.sender || profile,
          receiver: data.receiver || receiver
        });

        // Envoyer une notification
        await supabase.from('notifications').insert({
          user_id: receiver.id,
          title: "Nouveau message",
          message: `${profile.full_name} vous a envoyé un message`,
          type: 'message'
        });
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
