
import { useState, useCallback } from 'react';
import { Message, MessageSender } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIChat {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleVoiceInput: () => void;
  clearChat: () => Promise<void>;
}

export function useAIChat(): AIChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const { profile } = useProfile();

  const defaultSender: MessageSender = {
    id: profile?.id || '',
    full_name: profile?.full_name || 'User',
    avatar_url: profile?.avatar_url || '',
    online_status: true,
    last_seen: new Date().toISOString()
  };

  const addMessage = useCallback((content: string, sender: MessageSender = defaultSender) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: sender.id,
      receiver_id: 'assistant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender,
      timestamp: new Date().toISOString(),
      message_type: sender.id === 'assistant' ? 'ai' : 'user',
      status: 'sent',
      thinking: false
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [defaultSender]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setIsThinking(true);
    try {
      const userMessage = addMessage(message);
      setInputMessage('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: saveError } = await supabase
        .from('ai_chat_messages')
        .insert({
          id: userMessage.id,
          user_id: user.id,
          content: message,
          sender: 'user'
        });

      if (saveError) throw saveError;

      console.log("Getting AI response...");
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile,
          }
        }
      });

      if (error) throw error;

      console.log("AI response received:", data);

      const assistantMessage = addMessage(data.response, {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      });

      const { error: saveAssistantError } = await supabase
        .from('ai_chat_messages')
        .insert({
          id: assistantMessage.id,
          user_id: user.id,
          content: data.response,
          sender: 'assistant'
        });

      if (saveAssistantError) throw saveAssistantError;

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  }, [addMessage, messages, profile]);

  const handleVoiceInput = useCallback(() => {
    setIsListening(!isListening);
  }, [isListening]);

  const clearChat = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  }, []);

  return {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  };
}
