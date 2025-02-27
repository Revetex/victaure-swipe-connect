
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from '@/types/messages';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type RequestType = 'chat' | 'function' | 'vision';

interface UseVictaureChatProps {
  maxQuestions?: number;
  context?: string;
}

export function useVictaureChat({ maxQuestions = 3, context }: UseVictaureChatProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionsLeft, setQuestionsLeft] = useState(maxQuestions);

  const sendMessage = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const chatMessages: ChatMessage[] = [];
      
      if (context) {
        chatMessages.push({
          role: 'system',
          content: context
        });
      }

      chatMessages.push({
        role: 'user',
        content: userMessage
      });

      const { data, error } = await supabase.functions.invoke('victaure-chat', {
        body: { messages: chatMessages, type: 'chat' }
      });

      if (error) throw error;

      setQuestionsLeft(prev => Math.max(0, prev - 1));
      const response = data.choices[0].message.content;
      
      const newMessages: Message[] = [
        {
          id: `user-${Date.now()}`,
          content: userMessage,
          sender_id: 'user',
          receiver_id: 'assistant',
          created_at: new Date().toISOString(),
          read: true,
          status: 'sent',
          sender: {
            id: 'user',
            full_name: 'Vous',
            avatar_url: null,
            email: '',
            role: 'professional',
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        },
        {
          id: `assistant-${Date.now() + 1}`,
          content: response,
          sender_id: 'assistant',
          receiver_id: 'user',
          created_at: new Date().toISOString(),
          read: true,
          status: 'sent',
          sender: {
            id: 'assistant',
            full_name: 'Assistant',
            avatar_url: null,
            email: '',
            role: 'professional',
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        }
      ];
      
      setMessages(prev => [...prev, ...newMessages]);

      return response;

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    messages,
    questionsLeft
  };
}
