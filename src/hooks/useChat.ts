import { useState } from "react";
import { initializeSpeechRecognition } from "@/services/speechRecognitionService";
import { useMessages } from "./chat/useMessages";
import { useChatActions } from "./chat/useChatActions";
import type { ChatState, ChatActions } from "@/types/chat/messageTypes";
import { toast } from "sonner";

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
    handleSendMessage,
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