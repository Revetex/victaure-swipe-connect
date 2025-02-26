
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from '@/types/messages';

interface Message {
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
      const messages: Message[] = [];
      
      if (context) {
        messages.push({
          role: 'system',
          content: context
        });
      }

      messages.push({
        role: 'user',
        content: userMessage
      });

      const { data, error } = await supabase.functions.invoke('victaure-chat', {
        body: { messages, type: 'chat' }
      });

      if (error) throw error;

      setQuestionsLeft(prev => Math.max(0, prev - 1));
      const response = data.choices[0].message.content;
      
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response }
      ]);

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
