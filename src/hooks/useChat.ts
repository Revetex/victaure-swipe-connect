import { useState } from "react";
import { generateAIResponse } from "@/services/huggingFaceService";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      const response = await generateAIResponse(message, profile);

      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Désolé, je n'ai pas pu générer une réponse");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      toast.error("Erreur lors de la reconnaissance vocale");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const clearChat = () => {
    setMessages([]);
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
  };
}