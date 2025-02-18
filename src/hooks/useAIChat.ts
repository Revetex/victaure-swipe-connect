
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from './useProfile';
import { useAIMessages } from './chat/useAIMessages';
import { useJobActions } from './chat/useJobActions';
import { ConversationContext } from './chat/types';

export function useAIChat() {
  const [isThinking, setIsThinking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { profile } = useProfile();
  const [conversationContext, setConversationContext] = useState<ConversationContext>({ 
    messageCount: 0,
    acceptedJobs: [],
    rejectedJobs: []
  });

  const {
    messages,
    addUserMessage,
    addThinkingMessage,
    addAssistantMessage,
    removeThinkingMessages
  } = useAIMessages(profile);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !profile) {
      toast.error("Vous devez être connecté pour utiliser l'assistant");
      return;
    }

    try {
      addUserMessage(content);
      addThinkingMessage(profile);
      setIsThinking(true);

      const { data, error } = await supabase.functions.invoke<{
        response: string;
        context?: {
          intent: string;
          lastQuery: string;
        };
      }>('chat-ai', {
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

      addAssistantMessage(data.response, profile);
      
      if (data.context) {
        setConversationContext(prev => ({
          ...prev,
          messageCount: prev.messageCount + 1
        }));
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error("Une erreur est survenue avec l'assistant");
      removeThinkingMessages();
    } finally {
      setIsThinking(false);
      setInputMessage('');
    }
  }, [messages, profile, conversationContext, addUserMessage, addThinkingMessage, addAssistantMessage, removeThinkingMessages]);

  const { handleJobAccept, handleJobReject } = useJobActions(
    profile,
    setConversationContext,
    handleSendMessage
  );

  return {
    messages,
    isThinking,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    handleJobAccept,
    handleJobReject
  };
}
