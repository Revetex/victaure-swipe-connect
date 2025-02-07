
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

  const defaultSender: MessageSender = {
    id: profile?.id || '',
    full_name: profile?.full_name || 'User',
    avatar_url: profile?.avatar_url || '',
    online_status: true,
    last_seen: new Date().toISOString()
  };

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
        is_ai_message: receiver.id === 'assistant',
        read: false
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select('*, sender:profiles!messages_sender_id_fkey(*)');

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }

      setInputMessage('');
      
      if (data && data[0]) {
        // Update local messages state with the returned message including sender info
        setMessages(prev => [...prev, {
          ...data[0],
          sender: data[0].sender || defaultSender,
          timestamp: data[0].created_at
        }]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [profile, defaultSender]);

  const clearChat = useCallback(async (receiverId: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${profile.id})`);

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
