import { useState } from "react";
import { initializeSpeechRecognition } from "@/services/speechRecognitionService";
import { useMessages } from "./chat/useMessages";
import { useChatActions } from "./chat/useChatActions";
import type { ChatState, ChatActions } from "@/types/chat/messageTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useChat(): ChatState & ChatActions {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const {
    messages,
    setMessages,
    deletedMessages,
    setDeletedMessages
  } = useMessages();

  const {
    handleSendMessage: sendMessage,
    clearChat,
    restoreChat
  } = useChatActions(
    messages || [],
    setMessages,
    deletedMessages || [],
    setDeletedMessages,
    setInputMessage,
    setIsThinking
  );

  const handleSendMessage = async (message: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Vous devez être connecté pour utiliser le chat")
        return
      }
      
      await sendMessage(message)
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      toast.error("Une erreur est survenue lors de l'envoi du message")
      setIsThinking(false)
    }
  }

  const handleVoiceInput = () => {
    try {
      const recognition = initializeSpeechRecognition(setIsListening, setInputMessage);
      if (recognition) {
        recognition.start();
      } else {
        toast.error("La reconnaissance vocale n'est pas disponible sur votre navigateur");
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      toast.error("Erreur lors de l'initialisation de la reconnaissance vocale");
    }
  };

  return {
    messages: messages || [],
    deletedMessages: deletedMessages || [],
    inputMessage,
    isListening,
    isThinking,
    setMessages,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
    restoreChat
  };
}