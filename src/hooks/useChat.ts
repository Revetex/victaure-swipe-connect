import { useState, useCallback } from 'react';
import { MessageSender } from '@/types/messages';
import { useProfile } from './useProfile';

export function useChat() {
  const [messages, setMessages] = useState<Array<{
    content: string;
    sender: MessageSender;
    timestamp: string;
  }>>([]);
  const { profile } = useProfile();

  const defaultSender: MessageSender = {
    id: profile?.id || '',
    full_name: profile?.full_name || 'User',
    avatar_url: profile?.avatar_url || '',
    online_status: true,
    last_seen: new Date().toISOString()
  };

  const addMessage = useCallback((content: string, sender: MessageSender = defaultSender) => {
    setMessages(prev => [...prev, {
      content,
      sender,
      timestamp: new Date().toISOString()
    }]);
  }, [defaultSender]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages
  };
}