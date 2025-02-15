
import { useState, useCallback } from 'react';
import { Message } from '@/types/messages';

const defaultAssistant = {
  id: 'assistant',
  full_name: 'M. Victaure',
  avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
  online_status: true,
  last_seen: new Date().toISOString()
};

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender_id: 'user',
      receiver_id: 'assistant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read: false,
      sender: defaultAssistant,
      receiver: defaultAssistant,
      timestamp: new Date().toISOString(),
      message_type: 'assistant',
      status: 'sent',
      metadata: {},
      reaction: null,
      is_assistant: true,
      thinking: false
    };

    setMessages(prev => [...prev, newMessage]);
    setIsThinking(true);
  }, []);

  return {
    messages,
    isThinking,
    inputMessage,
    setInputMessage,
    handleSendMessage
  };
}
