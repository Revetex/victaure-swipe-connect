import { useState } from 'react';
import { Message } from '@/types/messages';

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isThinking,
    setIsThinking,
    isListening,
    setIsListening
  };
}