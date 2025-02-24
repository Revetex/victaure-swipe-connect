
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  context: string;
  maxQuestions: number;
  user: User | null;
  onMaxQuestionsReached?: () => void;
}

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
    // Pour l'instant, on vide juste les messages
    setMessages([]);
    setUserQuestions(0);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string, useWebSearch: boolean = false) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message de l'utilisateur
      setMessages(prev => [...prev, { content, isUser: true }]);
      setUserQuestions(prev => prev + 1);

      // Vérifier si l'utilisateur a atteint la limite
      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
      }

      const messagesForContext = [
        ...messages,
        { content, isUser: true }
      ];

      const { data, error } = await supabase.functions.invoke('victaure-chat', {
        body: { 
          messages: messagesForContext,
          context,
          userId: user?.id,
          useWebSearch,
          userProfile: user ? await getUserProfile(user.id) : null
        }
      });

      if (error) throw error;

      const assistantMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { content: assistantMessage, isUser: false }]);
      return assistantMessage;

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
