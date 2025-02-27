
import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { HfInference } from "@huggingface/inference";
import { Message } from "@/types/messages";

interface ChatMessage {
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
        const parsedMessages = JSON.parse(savedMessages);
        const formattedMessages: Message[] = parsedMessages.map((m: ChatMessage) => ({
          id: `msg-${Date.now()}-${Math.random()}`,
          content: m.content,
          sender_id: m.isUser ? 'user' : 'assistant',
          receiver_id: m.isUser ? 'assistant' : 'user',
          created_at: new Date(m.timestamp).toISOString(),
          read: true,
          status: 'sent',
          sender: {
            id: m.isUser ? 'user' : 'assistant',
            full_name: m.isUser ? 'Vous' : 'Assistant',
            avatar_url: null,
            email: '',
            role: 'professional',
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        }));
        setMessages(formattedMessages);
        setUserQuestions(formattedMessages.filter((m: Message) => m.sender_id === 'user').length);
      } catch (e) {
        console.error("Error loading saved messages:", e);
      }
    }
  }, []);

  // Sauvegarder les messages quand ils changent
  useEffect(() => {
    if (messages.length > 0) {
      const simplifiedMessages = messages.map(m => ({
        content: m.content,
        isUser: m.sender_id === 'user',
        timestamp: new Date(m.created_at).getTime()
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simplifiedMessages));
    }
  }, [messages]);

  const refreshMessages = useCallback(() => {
    setMessages([]);
    setUserQuestions(0);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Historique effacé");
  }, []);

  const sendMessage = useCallback(async (message: ChatMessage) => {
    if (!message.content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const newMessage: Message = {
        id: `user-${Date.now()}`,
        content: message.content,
        sender_id: 'user',
        receiver_id: 'assistant',
        created_at: new Date().toISOString(),
        read: true,
        status: 'sent',
        sender: {
          id: 'user',
          full_name: 'Vous',
          avatar_url: null,
          email: '',
          role: 'professional',
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        }
      };

      setMessages(prev => [...prev, newMessage]);
      setUserQuestions(prev => prev + 1);

      if (!user && userQuestions >= maxQuestions - 1) {
        onMaxQuestionsReached?.();
        return;
      }

      const historyPrompt = messages
        .map(m => `${m.sender_id === 'user' ? "Utilisateur" : "Assistant"}: ${m.content}`)
        .join("\n");

      const fullPrompt = `${context}\n\nHistorique de la conversation:\n${historyPrompt}\n\nUtilisateur: ${message.content}\n\nAssistant:`;

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
        id: `assistant-${Date.now()}`,
        content: result.generated_text.trim(),
        sender_id: 'assistant',
        receiver_id: 'user',
        created_at: new Date().toISOString(),
        read: true,
        status: 'sent',
        sender: {
          id: 'assistant',
          full_name: 'Assistant',
          avatar_url: null,
          email: '',
          role: 'professional',
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        }
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
