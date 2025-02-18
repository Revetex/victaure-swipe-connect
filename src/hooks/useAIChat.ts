
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
    acceptedJobs: string[];
    rejectedJobs: string[];
    lastSearchTerms?: string;
    lastLocation?: string;
  }>({ 
    messageCount: 0,
    acceptedJobs: [],
    rejectedJobs: []
  });

  const handleScrapeJobs = async (searchTerms: string, location: string) => {
    try {
      const { data: scrapingResult, error } = await supabase.functions.invoke<{
        success: boolean;
        jobsFound: number;
        jobs: any[];
        message: string;
      }>('scrape-jobs', {
        body: {
          searchTerms,
          location,
          isAssistantRequest: true
        }
      });

      if (error) throw error;
      
      setConversationContext(prev => ({
        ...prev,
        lastSearchTerms: searchTerms,
        lastLocation: location
      }));

      return scrapingResult;
    } catch (error) {
      console.error('Error scraping jobs:', error);
      throw error;
    }
  };

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
      
      // Ajouter un message "thinking" temporaire
      const thinkingMessage: Message = {
        ...userMessage,
        id: crypto.randomUUID(),
        content: "Recherche en cours...",
        sender_id: 'assistant',
        receiver_id: profile.id,
        is_assistant: true,
        thinking: true
      };
      
      setMessages(prev => [...prev, thinkingMessage]);
      setIsThinking(true);

      // Si le message demande une recherche d'emploi spécifique
      if (content.toLowerCase().includes('cherche') && content.toLowerCase().includes('emploi')) {
        try {
          const searchTerms = conversationContext.lastSearchTerms || "développeur";
          const location = conversationContext.lastLocation || "Québec";
          
          const scrapingResult = await handleScrapeJobs(searchTerms, location);
          
          if (scrapingResult.success) {
            const assistantMessage: Message = {
              id: crypto.randomUUID(),
              content: scrapingResult.message,
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
                suggestedJobs: scrapingResult.jobs,
                context: {
                  intent: 'job_search',
                  lastQuery: content
                }
              },
              reaction: null,
              is_assistant: true,
              thinking: false
            };

            setMessages(prev => [...prev.filter(m => !m.thinking), assistantMessage]);
            return;
          }
        } catch (error) {
          console.error('Error in job scraping:', error);
        }
      }

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

      // Remplacer le message "thinking" par la vraie réponse
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

      setMessages(prev => [...prev.filter(m => !m.thinking), assistantMessage]);
      
      if (data.context) {
        setConversationContext(prev => ({
          ...prev,
          lastIntent: data.context?.intent,
          lastQuery: data.context?.lastQuery,
          messageCount: prev.messageCount + 1
        }));
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error("Une erreur est survenue avec l'assistant");
      // Retirer le message "thinking" en cas d'erreur
      setMessages(prev => prev.filter(m => !m.thinking));
    } finally {
      setIsThinking(false);
      setInputMessage('');
    }
  }, [messages, profile, conversationContext]);

  const handleJobAccept = useCallback(async (jobId: string) => {
    try {
      // Sauvegarder l'intérêt pour le job
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
      
      // Demander à l'assistant de l'aide pour postuler
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
