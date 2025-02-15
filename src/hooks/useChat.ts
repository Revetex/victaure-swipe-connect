
import { useState, useCallback } from 'react';
import { Message, MessageSender, createEmptyMessage } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const defaultSender: MessageSender = {
  id: 'system',
  full_name: 'System',
  avatar_url: null,
  online_status: true,
  last_seen: new Date().toISOString()
};

export function useChat() {
  const [state, setState] = useState<{
    messages: Message[];
    inputMessage: string;
    isListening: boolean;
    isThinking: boolean;
  }>({
    messages: [],
    inputMessage: '',
    isListening: false,
    isThinking: false
  });
  const { profile } = useProfile();

  const addMessage = useCallback((content: string, receiver: MessageSender) => {
    if (!profile) return;

    const sender: MessageSender = {
      id: profile.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      online_status: true,
      last_seen: new Date().toISOString()
    };

    const newMessage = createEmptyMessage({
      id: crypto.randomUUID(),
      content,
      sender_id: sender.id,
      receiver_id: receiver.id,
      sender,
      receiver,
      message_type: receiver.id === 'assistant' ? 'assistant' : 'user',
      is_assistant: receiver.id === 'assistant'
    });

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return newMessage;
  }, [profile]);

  const setInputMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, inputMessage: message }));
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    try {
      const userMessage = addMessage(message, { id: 'assistant' });
      setInputMessage('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      setState(prev => ({ ...prev, isThinking: true }));

      const { error: saveError } = await supabase
        .from('messages')
        .insert({
          id: userMessage.id,
          content: message,
          sender_id: user.id,
          receiver_id: 'assistant',
          message_type: 'user',
          status: 'sent',
          metadata: {}
        });

      if (saveError) throw saveError;

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message,
          context: {
            previousMessages: state.messages.slice(-5),
            userProfile: profile,
          }
        }
      });

      if (error) throw error;

      const assistantMessage = addMessage(data.response, {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      });

      const { error: saveAssistantError } = await supabase
        .from('messages')
        .insert({
          id: assistantMessage.id,
          content: data.response,
          sender_id: 'assistant',
          receiver_id: user.id,
          message_type: 'assistant',
          status: 'sent',
          metadata: {}
        });

      if (saveAssistantError) throw saveAssistantError;

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setState(prev => ({ ...prev, isThinking: false }));
    }
  }, [addMessage, setInputMessage, state.messages, profile]);

  const handleVoiceInput = useCallback(() => {
    setState(prev => ({ ...prev, isListening: !prev.isListening }));
  }, []);

  const clearChat = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      setState(prev => ({ ...prev, messages: [] }));
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  }, []);

  return {
    messages: state.messages,
    inputMessage: state.inputMessage,
    isListening: state.isListening,
    isThinking: state.isThinking,
    setInputMessage: useCallback((message: string) => {
      setState(prev => ({ ...prev, inputMessage: message }));
    }, []),
    handleSendMessage,
    handleVoiceInput,
    clearChat
  };
}
