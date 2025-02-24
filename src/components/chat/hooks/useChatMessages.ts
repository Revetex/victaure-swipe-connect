
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Message {
  content: string;
  isUser: boolean;
  searchResults?: {
    title: string;
    url: string;
    snippet: string;
  }[];
  timestamp: number;
}

interface ChatMessagesProps {
  context: string;
  maxQuestions: number;
  user: User | null;
  onMaxQuestionsReached?: () => void;
}

const STORAGE_KEY = 'victaure_chat_messages';

export function useChatMessages({ 
  context, 
  maxQuestions, 
  user, 
  onMaxQuestionsReached 
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuestions, setUserQuestions] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const refreshMessages = useCallback(() => {
    setMessages([]);
    setUserQuestions(0);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique effacé");
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        setUserQuestions(parsed.filter((m: Message) => m.isUser).length);
      } catch (e) {
        console.error("Error loading saved messages:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const sendMessage = useCallback(async (content: string, useWebSearch: boolean = false) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = {
        content,
        isUser: true,
        timestamp: Date.now()
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      
      setUserQuestions(prev => prev + 1);

      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
        return;
      }

      const assistantPrompt = useWebSearch 
        ? context + "\nAnalyse tout fichier partagé et donne des retours détaillés. Pour les CV, fais une analyse approfondie. Utilise les informations du web pour répondre de manière détaillée et factuelle."
        : context;

      const { data, error } = await supabase.functions.invoke('victaure-chat', {
        body: { 
          messages: newMessages,
          context: assistantPrompt,
          userId: user?.id,
          useWebSearch,
          userProfile: user ? await getUserProfile(user.id) : null,
          maxTokens: useWebSearch ? 2000 : 800,
          temperature: useWebSearch ? 0.3 : 0.7
        }
      });

      if (error) {
        throw new Error("Erreur de communication avec l'assistant");
      }

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error("Réponse invalide de l'assistant");
      }

      const assistantMessage: Message = {
        content: data.choices[0].message.content,
        isUser: false,
        searchResults: data.searchResults,
        timestamp: Date.now()
      };
      
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
      
      return assistantMessage.content;

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, userQuestions, maxQuestions, context, onMaxQuestionsReached]);

  const getUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    return data;
  };

  return {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error,
    refreshMessages
  };
}
