
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface UseVictaureChatProps {
  onResponse?: (response: string) => void;
}

export function useVictaureChat({ onResponse }: UseVictaureChatProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage: string, context?: string) => {
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
        body: { messages }
      });

      if (error) throw error;

      const response = data.choices[0].message.content;
      onResponse?.(response);
      return response;

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Désolé, je ne suis pas disponible pour le moment");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
}
