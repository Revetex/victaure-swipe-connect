
import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { HfInference } from "@huggingface/inference";

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
  hf: HfInference;
}

const STORAGE_KEY = 'victaure_chat_messages';

export function useChatMessages({ 
  context, 
  maxQuestions, 
  user, 
  onMaxQuestionsReached,
  hf
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

  const sendMessage = useCallback(async (message: Message) => {
    if (!message.content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Ajouter le message de l'utilisateur
      setMessages(prev => [...prev, message]);
      setUserQuestions(prev => prev + 1);

      // Vérifier si l'utilisateur a atteint la limite
      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
        return;
      }

      // Construire le contexte complet pour l'IA
      const historyPrompt = messages
        .map(m => `${m.isUser ? "Utilisateur" : "Assistant"}: ${m.content}`)
        .join("\n");

      const fullPrompt = `${context}\n\nHistorique de la conversation:\n${historyPrompt}\n\nUtilisateur: ${message.content}\n\nAssistant:`;

      // Utiliser l'API HuggingFace
      const result = await hf.textGeneration({
        model: "OpenAssistant/oasst-sft-6-llama-30b",
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.2
        }
      });

      if (!result.generated_text) {
        throw new Error("Pas de réponse de l'assistant");
      }

      const assistantMessage: Message = {
        content: result.generated_text.trim(),
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
  }, [context, messages, user, userQuestions, maxQuestions, onMaxQuestionsReached, hf]);

  return {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error,
    refreshMessages
  };
}
