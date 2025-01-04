import { useState } from "react";
import { initializeSpeechRecognition } from "@/services/speechRecognitionService";
import { useMessages } from "./chat/useMessages";
import { useChatActions } from "./chat/useChatActions";
import type { ChatState, ChatActions } from "@/types/chat/messageTypes";

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
    messages,
    setMessages,
    deletedMessages,
    setDeletedMessages,
    setInputMessage,
    setIsThinking
  );

  const handleVoiceInput = () => {
    const recognition = initializeSpeechRecognition(setIsListening, setInputMessage);
    if (recognition) {
      recognition.start();
    }
  };

  return {
    messages,
    deletedMessages,
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