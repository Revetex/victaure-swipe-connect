
import { useState, useCallback } from 'react';
import { Message, Receiver } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMessagesStore } from '@/store/messagesStore';
import { useMessageSubscription } from './useMessageSubscription';
import { usePresenceTracking } from './usePresenceTracking';
import { sendMessage } from '@/utils/messageSender';

interface UserChat {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, receiver: Receiver) => Promise<void>;
  clearChat: (receiverId: string) => Promise<void>;
}

export function useUserChat(): UserChat {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { messages, setMessages, addMessage } = useMessagesStore();

  useMessageSubscription(profile);
  usePresenceTracking(profile);

  const handleSendMessage = useCallback(async (message: string, receiver: Receiver) => {
    if (!message.trim() || !profile) return;
    
    setIsLoading(true);
    try {
      const newMessage = await sendMessage(message, receiver, profile);
      if (newMessage) {
        addMessage(newMessage);
        setInputMessage('');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [profile, addMessage, setInputMessage]);

  const clearChat = useCallback(async (receiverId: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${profile.id})`);

      if (error) throw error;
      setMessages([]);
    } catch (error) {
      console.error('Erreur effacement conversation:', error);
    }
  }, [profile, setMessages]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    clearChat
  };
}
