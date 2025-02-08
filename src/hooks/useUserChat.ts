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

  const addMessage = useCallback((content: string, receiver: Receiver, sender: MessageSender = defaultSender) => {
    console.log("Adding user message:", { content, receiver, sender });
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: sender.id,
      receiver_id: receiver.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [defaultSender]);

  const handleSendMessage = useCallback(async (message: string, receiver: Receiver) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const newMessage = addMessage(message, receiver);
      setInputMessage('');

      const { error } = await supabase
        .from('messages')
        .insert({
          id: newMessage.id,
          sender_id: defaultSender.id,
          receiver_id: receiver.id,
          content: message,
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, defaultSender]);

  const clearChat = useCallback(async (receiverId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${defaultSender.id},receiver_id.eq.${defaultSender.id}`)
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  }, [defaultSender.id]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    clearChat
  };
}