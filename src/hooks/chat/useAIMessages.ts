
import { useState } from 'react';
import { Message } from '@/types/messages';
import { UserProfile } from '@/types/profile';
import { ConversationContext } from './types';

const defaultAssistant = {
  id: '00000000-0000-0000-0000-000000000000',
  full_name: 'M. Victaure',
  avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
  online_status: true,
  last_seen: new Date().toISOString()
};

export function useAIMessages(profile: UserProfile | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addUserMessage = (content: string) => {
    if (!profile) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: profile.id,
      receiver_id: defaultAssistant.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender: profile,
      receiver: defaultAssistant,
      timestamp: new Date().toISOString(),
      message_type: 'user',
      status: 'sent',
      metadata: {},
      reaction: null,
      is_assistant: false,
      thinking: false
    };

    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };

  const addThinkingMessage = (profile: UserProfile) => {
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
  };

  const addAssistantMessage = (content: string, profile: UserProfile) => {
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      content,
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
      thinking: false
    };

    setMessages(prev => [...prev.filter(m => !m.thinking), assistantMessage]);
    return assistantMessage;
  };

  const removeThinkingMessages = () => {
    setMessages(prev => prev.filter(m => !m.thinking));
  };

  return {
    messages,
    addUserMessage,
    addThinkingMessage,
    addAssistantMessage,
    removeThinkingMessages,
    defaultAssistant
  };
}
