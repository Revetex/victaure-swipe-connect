
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface ChatMessagesProps {
  context: string;
  maxQuestions: number;
  user: User | null;
  onMaxQuestionsReached?: () => void;
  geminiModel?: GenerativeModel;
}

const STORAGE_KEY = 'victaure_chat_messages';

export function useChatMessages({ 
  context, 
  maxQuestions, 
  user, 
  onMaxQuestionsReached,
  geminiModel 
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

  const sendMessage = useCallback(async (content: string) => {
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

      let response: string;

      if (geminiModel) {
        // Utiliser l'API Gemini
        const result = await geminiModel.generateContent([
          context,
          ...messages.map(m => m.content),
          content
        ]);
        response = result.response.text();
      } else {
        // Fallback sur l'API Supabase
        const { data, error } = await supabase.functions.invoke('victaure-chat', {
          body: { 
            messages: [...messages, userMessage],
            context,
            userId: user?.id,
          }
        });

        if (error) throw error;
        if (!data?.choices?.[0]?.message?.content) {
          throw new Error("Réponse invalide de l'assistant");
        }

        response = data.choices[0].message.content;
      }

      const assistantMessage: Message = {
        content: response,
        isUser: false,
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
  }, [messages, user, userQuestions, maxQuestions, context, onMaxQuestionsReached, geminiModel]);

  return {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error,
    refreshMessages
  };
}
