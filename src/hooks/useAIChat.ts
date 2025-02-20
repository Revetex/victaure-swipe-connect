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

  const handleScrapeJobs = async (searchTerms: string, location: string, sourcesToTry?: string[]) => {
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
          isAssistantRequest: true,
          sources: sourcesToTry
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

  const tryAlternativeSearch = async (originalTerms: string, location: string) => {
    const alternatives = [
      { terms: originalTerms, sources: ['jobbank', 'indeed'] },
      { terms: `${originalTerms} construction`, sources: ['jobillico', 'jobboom'] },
      { terms: 'surintendant chantier', sources: ['randstad', 'ziprecruiter'] },
      { terms: 'superviseur construction', sources: ['jobbank', 'indeed'] },
      { terms: 'contremaître', sources: ['jobillico', 'jobboom'] }
    ];

    let allJobs: any[] = [];
    let totalFound = 0;

    for (const alt of alternatives) {
      const result = await handleScrapeJobs(alt.terms, location, alt.sources);
      if (result.success && result.jobs.length > 0) {
        allJobs = [...allJobs, ...result.jobs];
        totalFound += result.jobsFound;
      }
    }

    return {
      success: totalFound > 0,
      jobsFound: totalFound,
      jobs: allJobs.slice(0, 5),
      message: `J'ai trouvé ${totalFound} emplois potentiels en élargissant la recherche. Voici les plus pertinents pour votre profil.`
    };
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
      
      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "Analyse en cours...",
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

      if (content.toLowerCase().includes('cherche') || 
          content.toLowerCase().includes('emploi') || 
          content.toLowerCase().includes('travail')) {
        try {
          const searchTerms = content.toLowerCase().includes('surintendant') ? 'surintendant' :
                            content.toLowerCase().includes('superviseur') ? 'superviseur' :
                            conversationContext.lastSearchTerms || "surintendant chantier";
          
          const location = content.toLowerCase().includes('montréal') ? 'Montréal' :
                          content.toLowerCase().includes('québec') ? 'Québec' :
                          content.toLowerCase().includes('trois-rivières') ? 'Trois-Rivières' :
                          conversationContext.lastLocation || "Trois-Rivières";
          
          let scrapingResult = await handleScrapeJobs(searchTerms, location);
          
          if (!scrapingResult.success || scrapingResult.jobsFound === 0) {
            scrapingResult = await tryAlternativeSearch(searchTerms, location);
          }
          
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
