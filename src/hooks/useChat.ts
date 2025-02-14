
import { useState, useCallback } from 'react';
import { Message, MessageSender } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChatState {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    inputMessage: '',
    isListening: false,
    isThinking: false
  });
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
      message_type: sender.id === 'assistant' ? 'assistant' : 'user',
      status: 'sent',
      thinking: false,
      metadata: {}
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return newMessage;
  }, [defaultSender]);

  const setInputMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, inputMessage: message }));
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    try {
      // Ajouter immédiatement le message de l'utilisateur
      const userMessage = addMessage(message);
      setInputMessage('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Simuler le début de la réponse
      setState(prev => ({ ...prev, isThinking: true }));

      // Sauvegarder le message dans la base de données
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

      // Obtenir la réponse de l'IA
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

      // Sauvegarder la réponse de l'assistant
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
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  };
}
