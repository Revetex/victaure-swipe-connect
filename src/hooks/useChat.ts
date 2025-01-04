import { useState, useEffect } from "react";
import { Message, ChatState, ChatActions } from "@/types/chat/types";
import { generateAIResponse, saveMessage, loadMessages } from "@/services/aiChatService";
import { initializeSpeechRecognition } from "@/services/speechRecognitionService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useChat(): ChatState & ChatActions {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Initializing chat...");
        const savedMessages = await loadMessages();
        const formattedMessages = savedMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "user" | "assistant",
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
        
        // Si aucun message n'existe, envoyer le message d'accueil
        if (formattedMessages.length === 0 && !hasInitialMessage) {
          const welcomeMessage = {
            id: crypto.randomUUID(),
            content: "Bonjour ! Je suis M. Victaure, votre assistant IA personnel. Je suis là pour vous aider dans votre parcours professionnel. Comment puis-je vous assister aujourd'hui ?",
            sender: "assistant" as const,
            timestamp: new Date(),
          };
          
          setMessages([welcomeMessage]);
          await saveMessage({
            ...welcomeMessage,
            created_at: welcomeMessage.timestamp,
          });
          setHasInitialMessage(true);
        }
        
        console.log("Chat initialized with messages:", formattedMessages);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Erreur lors du chargement des messages");
      }
    };
    initializeChat();
  }, [hasInitialMessage]);

  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    try {
      console.log("Sending message:", message);
      
      const newUserMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newUserMessage]);
      await saveMessage({
        ...newUserMessage,
        created_at: newUserMessage.timestamp,
      });
      setInputMessage("");
      setIsThinking(true);

      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "...",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thinkingMessage]);

      try {
        console.log("Generating AI response...");
        const response = await generateAIResponse(message, profile);
        
        if (!response) {
          throw new Error("Pas de réponse de l'IA");
        }

        console.log("AI response generated:", response);

        const newAssistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== thinkingMessage.id);
          return [...filtered, newAssistantMessage];
        });

        await saveMessage({
          ...newAssistantMessage,
          created_at: newAssistantMessage.timestamp,
        });

      } catch (error) {
        console.error("Error in AI response generation:", error);
        setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
        
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Une erreur est survenue lors de la génération de la réponse");
        }
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = initializeSpeechRecognition(setIsListening, setInputMessage);
    if (recognition) {
      recognition.start();
    }
  };

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      setDeletedMessages(messages);
      setMessages([]);

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Erreur dans clearChat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
      throw error;
    }
  };

  const restoreChat = async () => {
    if (deletedMessages.length === 0) {
      toast.error("Aucune conversation à restaurer");
      return;
    }

    try {
      for (const message of deletedMessages) {
        await saveMessage({
          ...message,
          created_at: message.timestamp,
        });
      }
      setMessages(deletedMessages);
      setDeletedMessages([]);
      toast.success("Conversation restaurée avec succès");
    } catch (error) {
      console.error('Erreur dans restoreChat:', error);
      toast.error("Erreur lors de la restauration de la conversation");
      throw error;
    }
  };

  return {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setMessages,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
    restoreChat,
    deletedMessages
  };
}
