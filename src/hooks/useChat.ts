
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
      sender_id: sender.id === 'assistant' ? profile?.id || '' : sender.id,
      receiver_id: sender.id === 'assistant' ? profile?.id || '' : 'assistant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender,
      timestamp: new Date().toISOString(),
      message_type: sender.id === 'assistant' ? 'ai' : 'user',
      status: 'sent',
      thinking: false,
      metadata: {}
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    return newMessage;
  }, [defaultSender, profile?.id]);

  const setInputMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, inputMessage: message }));
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setState(prev => ({ ...prev, isThinking: true }));
    try {
      const userMessage = addMessage(message);
      setInputMessage('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Save user message to database
      const { error: saveError } = await supabase
        .from('messages')
        .insert({
          id: userMessage.id,
          sender_id: user.id,
          receiver_id: user.id,
          content: message,
          message_type: 'user',
          is_ai_message: false
        });

      if (saveError) throw saveError;

      console.log("Getting AI response...");
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

      console.log("AI response received:", data);

      const assistantMessage = addMessage(data.response, {
        id: 'assistant',
        full_name: 'M. Victaure',
        avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
        online_status: true,
        last_seen: new Date().toISOString()
      });

      // Save assistant message to database
      const { error: saveAssistantError } = await supabase
        .from('messages')
        .insert({
          id: assistantMessage.id,
          sender_id: user.id,
          receiver_id: user.id,
          content: data.response,
          message_type: 'ai',
          is_ai_message: true
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
        .eq('sender_id', user.id)
        .eq('receiver_id', user.id);

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
    setInputMessage: (message: string) => setState(prev => ({ ...prev, inputMessage: message })),
    handleSendMessage: handleSendMessage,
    handleVoiceInput: handleVoiceInput,
    clearChat: clearChat
  };
}
