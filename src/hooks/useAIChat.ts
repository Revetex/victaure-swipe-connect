
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from './useProfile';
import { useAIMessages } from './chat/useAIMessages';
import { useJobActions } from './chat/useJobActions';
import { ConversationContext } from './chat/types';

// UUID constant for the assistant
const ASSISTANT_ID = '00000000-0000-0000-0000-000000000000';

export function useAIChat() {
  const [isThinking, setIsThinking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { profile } = useProfile();
  const [conversationContext, setConversationContext] = useState<ConversationContext>({ 
    messageCount: 0,
    acceptedJobs: [],
    rejectedJobs: [],
    hasGreeted: false
  });

  const {
    messages,
    addUserMessage,
    addThinkingMessage,
    addAssistantMessage,
    removeThinkingMessages
  } = useAIMessages(profile);

  const handleFileAttach = useCallback(async (file: File, messageId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageId', messageId);

    const { data, error } = await supabase.functions.invoke('upload-chat-file', {
      body: formData,
    });

    if (error) throw error;
    return data;
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !profile) {
      toast.error("Vous devez être connecté pour utiliser l'assistant");
      return;
    }

    try {
      addUserMessage(content);
      addThinkingMessage(profile);
      setIsThinking(true);

      // Insert the user message into Supabase
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: profile.id,
          receiver_id: ASSISTANT_ID,
          message_type: 'user',
          is_assistant: false,
          status: 'sent',
          metadata: {},
          read: false
        });

      if (userMessageError) throw userMessageError;

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
            conversationState: conversationContext,
            hasGreeted: conversationContext.hasGreeted
          }
        }
      });

      if (error) throw error;
      if (!data?.response) throw new Error('Invalid response format from AI');

      // Insert the assistant's response into Supabase
      const { error: assistantMessageError } = await supabase
        .from('messages')
        .insert({
          content: data.response,
          sender_id: ASSISTANT_ID,
          receiver_id: profile.id,
          message_type: 'assistant',
          is_assistant: true,
          status: 'sent',
          metadata: {},
          read: false
        });

      if (assistantMessageError) throw assistantMessageError;

      addAssistantMessage(data.response, profile);
      
      setConversationContext(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        hasGreeted: true
      }));

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
    handleJobReject,
    handleFileAttach
  };
}
