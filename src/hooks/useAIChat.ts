
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

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { profile } = useProfile();
  const [conversationContext, setConversationContext] = useState<{
    messageCount: number;
    acceptedJobs: string[];
    rejectedJobs: string[];
  }>({ 
    messageCount: 0,
    acceptedJobs: [],
    rejectedJobs: []
  });

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !profile) {
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
      
      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "En train de réfléchir...",
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
        metadata: {},
        reaction: null,
        is_assistant: true,
        thinking: true
      };
      
      setMessages(prev => [...prev, thinkingMessage]);
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
        metadata: {},
        reaction: null,
        is_assistant: true,
        thinking: false
      };

      setMessages(prev => [...prev.filter(m => !m.thinking), assistantMessage]);
      
      if (data.context) {
        setConversationContext(prev => ({
          ...prev,
          messageCount: prev.messageCount + 1
        }));
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error("Une erreur est survenue avec l'assistant");
      setMessages(prev => prev.filter(m => !m.thinking));
    } finally {
      setIsThinking(false);
      setInputMessage('');
    }
  }, [messages, profile, conversationContext]);

  const handleJobAccept = useCallback(async (jobId: string) => {
    try {
      await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: profile?.id,
          status: 'interested'
        });

      setConversationContext(prev => ({
        ...prev,
        acceptedJobs: [...prev.acceptedJobs, jobId]
      }));

      toast.success("Votre intérêt a été enregistré!");
      
      handleSendMessage("Je suis intéressé par ce poste, pouvez-vous m'aider à postuler ?");
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error("Erreur lors de l'enregistrement de votre intérêt");
    }
  }, [profile, handleSendMessage]);

  const handleJobReject = useCallback((jobId: string) => {
    setConversationContext(prev => ({
      ...prev,
      rejectedJobs: [...prev.rejectedJobs, jobId]
    }));
  }, []);

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
