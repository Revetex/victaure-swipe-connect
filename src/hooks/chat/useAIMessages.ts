
import { useState, useCallback } from 'react';
import { Message } from '@/types/messages';
import { UserProfile } from '@/types/profile';

const defaultAssistant = {
  id: '00000000-0000-0000-0000-000000000000',
  full_name: 'M. Victaure',
  avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
  online_status: true,
  last_seen: new Date().toISOString()
};

export function useAIMessages({ profile }: { profile: UserProfile | null }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((content: string, isUser: boolean) => {
    if (!profile) return null;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: isUser ? profile.id : defaultAssistant.id,
      receiver_id: isUser ? defaultAssistant.id : profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender: isUser ? profile : defaultAssistant,
      receiver: isUser ? defaultAssistant : profile,
      timestamp: new Date().toISOString(),
      message_type: isUser ? 'user' : 'assistant',
      status: 'sent',
      metadata: {},
      reaction: null,
      is_assistant: !isUser,
      thinking: false
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [profile]);

  const addUserMessage = useCallback((content: string) => {
    return addMessage(content, true);
  }, [addMessage]);

  const addAssistantMessage = useCallback((content: string) => {
    return addMessage(content, false);
  }, [addMessage]);

  const addThinkingMessage = useCallback(() => {
    if (!profile) return null;

    const thinkingMessage: Message = {
      id: crypto.randomUUID(),
      content: "En train de réfléchir...",
      sender_id: defaultAssistant.id,
      receiver_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender: defaultAssistant,
      receiver: profile,
      timestamp: new Date().toISOString(),
      message_type: 'assistant',
      status: 'sent',
      metadata: {},
      reaction: null,
      is_assistant: true,
      thinking: true
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    return thinkingMessage;
  }, [profile]);

  const removeThinkingMessages = useCallback(() => {
    setMessages(prev => prev.filter(m => !m.thinking));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addThinkingMessage,
    removeThinkingMessages,
    clearMessages,
    defaultAssistant
  };
}
