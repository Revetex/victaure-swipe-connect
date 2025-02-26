
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

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        console.log("Loading saved messages:", parsedMessages); // Log pour déboguer
        setMessages(parsedMessages);
        setUserQuestions(parsedMessages.filter((m: Message) => m.isUser).length);
      } catch (e) {
        console.error("Error loading saved messages:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Saving messages:", messages); // Log pour déboguer
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (message: Message) => {
    if (!message.content.trim() || !geminiModel) return;

    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message de l'utilisateur
      const updatedMessages = [...messages, message];
      console.log("Adding user message:", message); // Log pour déboguer
      setMessages(updatedMessages);
      setUserQuestions(prev => prev + 1);

      // Vérifier si l'utilisateur a atteint la limite
      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
        return;
      }

      // Construire le contexte complet pour l'IA
      const historyPrompt = updatedMessages
        .map(m => `${m.isUser ? "Utilisateur" : "Assistant"}: ${m.content}`)
        .join("\n");

      const fullPrompt = `${context}\n\nHistorique de la conversation:\n${historyPrompt}\n\nUtilisateur: ${message.content}\n\nAssistant:`;
      console.log("Sending prompt to Gemini:", fullPrompt); // Log pour déboguer

      // Utiliser l'API Gemini
      const result = await geminiModel.generateContent(fullPrompt);
      const response = result.response.text();
      console.log("Received response from Gemini:", response); // Log pour déboguer

      if (!response) {
        throw new Error("Pas de réponse de l'assistant");
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
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [context, messages, user, userQuestions, maxQuestions, onMaxQuestionsReached, geminiModel]);

  const refreshMessages = useCallback(() => {
    console.log("Refreshing messages"); // Log pour déboguer
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
