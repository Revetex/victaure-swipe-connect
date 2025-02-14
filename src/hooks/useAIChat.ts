
import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/messages';
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
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  const formatAIMessage = (aiMessage: any): Message => ({
    id: aiMessage.id,
    content: aiMessage.content,
    sender_id: aiMessage.sender === 'assistant' ? 'assistant' : profile?.id || '',
    receiver_id: aiMessage.sender === 'assistant' ? profile?.id || '' : 'assistant',
    created_at: aiMessage.created_at,
    updated_at: aiMessage.updated_at,
    read: aiMessage.read,
    sender: {
      id: aiMessage.sender === 'assistant' ? 'assistant' : profile?.id || '',
      full_name: aiMessage.sender === 'assistant' ? 'M. Victaure' : profile?.full_name || '',
      avatar_url: aiMessage.sender === 'assistant' ? '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png' : profile?.avatar_url || '',
      online_status: true,
      last_seen: new Date().toISOString()
    },
    timestamp: aiMessage.created_at,
    message_type: 'assistant',
    status: 'sent',
    metadata: {}
  });

  const loadMessages = useCallback(async () => {
    if (!profile?.id || isLoading) return;
    
    try {
      setIsLoading(true);
      const { data: aiMessages, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(aiMessages.map(formatAIMessage));
    } catch (error) {
      console.error('Error loading AI messages:', error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !profile?.id) return;
    
    setIsThinking(true);
    try {
      // Add user message to AI messages
      const { data: userMessage, error: userMessageError } = await supabase
        .from('ai_messages')
        .insert({
          content: message,
          user_id: profile.id,
          sender: 'user',
          read: true
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message,
          userId: profile.id,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile,
          }
        }
      });

      if (error) throw error;

      // Save AI response
      const { data: aiMessage, error: aiMessageError } = await supabase
        .from('ai_messages')
        .insert({
          content: data.response,
          user_id: profile.id,
          sender: 'assistant',
          read: false
        })
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      // Update messages state
      setMessages(prev => [...prev, formatAIMessage(userMessage), formatAIMessage(aiMessage)]);
      setInputMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  }, [messages, profile]);

  const handleVoiceInput = useCallback(() => {
    setIsListening(!isListening);
  }, [isListening]);

  const clearChat = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      const { error } = await supabase
        .from('ai_messages')
        .delete()
        .eq('user_id', profile.id);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée");
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id) {
      loadMessages();
    }
  }, [profile?.id, loadMessages]);

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
