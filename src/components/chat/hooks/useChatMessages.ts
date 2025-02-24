
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

  // Charger les messages sauvegardés au démarrage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
        setUserQuestions(JSON.parse(savedMessages).filter((m: Message) => m.isUser).length);
      } catch (e) {
        console.error("Error loading saved messages:", e);
      }
    }
  }, []);

  // Sauvegarder les messages quand ils changent
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const refreshMessages = useCallback(() => {
    setMessages([]);
    setUserQuestions(0);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique effacé");
  }, []);

  const sendMessage = useCallback(async (content: string, useWebSearch: boolean = false) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        content,
        isUser: true,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      setUserQuestions(prev => prev + 1);

      // Vérifier si l'utilisateur a atteint la limite
      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
      }

      const messagesForContext = [
        ...messages,
        userMessage
      ];

      const assistantPrompt = useWebSearch 
        ? context + "\nUtilise les informations du web pour répondre de manière détaillée et factuelle. Cite tes sources et résume les informations pertinentes. N'oublie pas de vérifier les informations avant de répondre."
        : context + "\nRéponds de manière conversationnelle et naturelle, sans chercher d'informations supplémentaires.";

      const { data, error } = await supabase.functions.invoke('victaure-chat', {
        body: { 
          messages: messagesForContext,
          context: assistantPrompt,
          userId: user?.id,
          useWebSearch,
          userProfile: user ? await getUserProfile(user.id) : null,
          maxTokens: useWebSearch ? 2000 : 800,
          temperature: useWebSearch ? 0.3 : 0.7, // Plus factuel en mode web
          searchResults: useWebSearch
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error("Erreur de communication avec l'assistant");
      }

      if (!data || !data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Réponse invalide de l'assistant");
      }

      const assistantMessage: Message = {
        content: data.choices[0].message.content,
        isUser: false,
        searchResults: data.searchResults,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage.content;

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error("Erreur lors de l'envoi du message", {
        description: err instanceof Error ? err.message : "Une erreur inattendue s'est produite"
      });
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
