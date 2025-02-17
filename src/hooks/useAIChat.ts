
import { useState, useCallback } from 'react';
import { Message } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from './useProfile';

const defaultAssistant = {
  id: 'assistant',
  full_name: 'M. Victaure',
  avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
  online_status: true,
  last_seen: new Date().toISOString()
};

interface AIResponse {
  response: string;
  suggestedJobs?: any[];
  context?: {
    intent: string;
    lastQuery: string;
  };
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { profile } = useProfile();
  const [conversationContext, setConversationContext] = useState<{
    lastIntent?: string;
    lastQuery?: string;
    messageCount: number;
  }>({ messageCount: 0 });

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!profile) {
      toast.error("Vous devez être connecté pour utiliser l'assistant");
      return;
    }

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        sender_id: profile.id,
        receiver_id: 'assistant',
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
      setIsThinking(true);

      const { data, error } = await supabase.functions.invoke<AIResponse>('chat-ai', {
        body: { 
          message: content,
          userId: profile.id,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile,
            conversationState: conversationContext
          }
        }
      });

      if (error) throw error;
      if (!data?.response) throw new Error('Invalid response format from AI');

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        sender_id: 'assistant',
        receiver_id: profile.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        read: false,
        sender: defaultAssistant,
        receiver: profile,
        timestamp: new Date().toISOString(),
        message_type: 'assistant',
        status: 'sent',
        metadata: { 
          suggestedJobs: data.suggestedJobs,
          context: data.context
        },
        reaction: null,
        is_assistant: true,
        thinking: false
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Mettre à jour le contexte de la conversation
      if (data.context) {
        setConversationContext(prev => ({
          lastIntent: data.context?.intent,
          lastQuery: data.context?.lastQuery,
          messageCount: prev.messageCount + 1
        }));
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error("Une erreur est survenue avec l'assistant");
    } finally {
      setIsThinking(false);
      setInputMessage('');
    }
  }, [messages, profile, conversationContext]);

  return {
    messages,
    isThinking,
    inputMessage,
    setInputMessage,
    handleSendMessage
  };
}
