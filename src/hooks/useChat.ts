import { useState } from "react";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: crypto.randomUUID(),
    content: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
    sender: "assistant",
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      // Simulate a response from the assistant
      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "Je suis là pour vous aider. Que puis-je faire pour vous ?",
        sender: "assistant",
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, newAssistantMessage]);
        setIsThinking(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Désolé, je n'ai pas pu répondre. Veuillez réessayer.");
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