
import { useState, useCallback } from 'react';
import { Message, MessageSender, Receiver } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserChat {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, receiver: Receiver) => Promise<void>;
  clearChat: (receiverId: string) => Promise<void>;
}

export function useUserChat(): UserChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  const handleSendMessage = useCallback(async (message: string, receiver: Receiver) => {
    if (!message.trim()) return;
    if (!profile) {
      toast.error("Vous devez être connecté pour envoyer des messages");
      return;
    }
    
    setIsLoading(true);
    try {
      const newMessage = {
        content: message,
        sender_id: profile.id,
        receiver_id: receiver.id,
        message_type: 'user',
        read: false
      };

      // Enregistrer le message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert(newMessage)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `);

      if (messageError) throw messageError;

      // Créer une notification
      const notification = {
        user_id: receiver.id,
        title: "Nouveau message",
        message: `${profile.full_name} vous a envoyé un message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
        type: 'message'
      };

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notification);

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      setInputMessage('');
      
      if (messageData && messageData[0]) {
        const formattedMessage: Message = {
          ...messageData[0],
          timestamp: messageData[0].created_at,
          sender: messageData[0].sender || {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url || '',
            online_status: true,
            last_seen: new Date().toISOString()
          },
          receiver: messageData[0].receiver || receiver
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const clearChat = useCallback(async (receiverId: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  }, [profile]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    clearChat
  };
}
