import { useState, useCallback } from 'react';
import { Message, MessageSender } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

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
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, [defaultSender]);

  const setInputMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, inputMessage: message }));
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setState(prev => ({ ...prev, isThinking: true }));
    try {
      addMessage(message);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setState(prev => ({ ...prev, isThinking: false }));
    }
  }, [addMessage, setInputMessage]);

  const handleVoiceInput = useCallback(() => {
    setState(prev => ({ ...prev, isListening: !prev.isListening }));
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
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