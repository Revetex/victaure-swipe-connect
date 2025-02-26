
import { useState, useCallback, useEffect } from "react";
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
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        const userMessageCount = parsedMessages.filter((m: Message) => m.isUser).length;
        setUserQuestions(userMessageCount);
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

  const sendMessage = useCallback(async (message: Message) => {
    if (!message.content.trim()) {
      console.log("Empty message, not sending");
      return;
    }

    if (!geminiModel) {
      console.error("Gemini model not initialized");
      toast.error("Le service de chat n'est pas disponible pour le moment");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Mettre à jour les messages immédiatement avec le message de l'utilisateur
      setMessages(prevMessages => [...prevMessages, message]);
      
      // Vérifier la limite de questions
      const newQuestionCount = userQuestions + 1;
      if (!user && newQuestionCount >= maxQuestions) {
        onMaxQuestionsReached?.();
        setUserQuestions(newQuestionCount);
        return;
      }

      // Préparer le contexte pour l'IA
      const historyPrompt = [...messages, message]
        .map(m => `${m.isUser ? "Utilisateur" : "Assistant"}: ${m.content}`)
        .join("\n");

      const fullPrompt = `${context}\n\nHistorique de la conversation:\n${historyPrompt}\n\nAssistant:`;
      console.log("Sending to Gemini:", fullPrompt);

      // Obtenir la réponse de l'IA
      const result = await geminiModel.generateContent(fullPrompt);
      const response = result.response.text();
      console.log("Received from Gemini:", response);

      if (!response) {
        throw new Error("Pas de réponse de l'assistant");
      }

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        content: response,
        isUser: false,
        timestamp: Date.now()
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setUserQuestions(newQuestionCount);

      return response;

    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error("Erreur lors de l'envoi du message");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [context, messages, user, userQuestions, maxQuestions, onMaxQuestionsReached, geminiModel]);

  const refreshMessages = useCallback(() => {
    setMessages([]);
    setUserQuestions(0);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique effacé");
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error,
    refreshMessages
  };
}
