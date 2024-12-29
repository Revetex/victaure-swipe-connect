import { useState, useCallback } from "react";

export type MessageType = {
  id: string;
  role: "assistant" | "user";
  content: string;
  type?: "job_creation" | "text";
  step?: "title" | "description" | "budget" | "location" | "category" | "confirm";
  sender: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  timestamp: Date;
};

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [currentStep, setCurrentStep] = useState<MessageType["step"]>();
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  const sendMessage = useCallback((content: string) => {
    setIsThinking(true);
    // Add user message
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: "user",
      content,
      sender: {
        id: "user",
        full_name: "You"
      },
      timestamp: new Date()
    }]);

    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I can help you with that! Would you like to create a new mission or update your profile?",
        sender: {
          id: "assistant",
          full_name: "Mr. Victaure"
        },
        timestamp: new Date()
      }]);
      setIsThinking(false);
    }, 1000);
  }, []);

  const handleJobResponse = useCallback((response: string) => {
    if (response.toLowerCase().includes("créer") && response.toLowerCase().includes("mission")) {
      setIsCreatingJob(true);
      setCurrentStep("title");
      const newMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "D'accord, je vais vous aider à créer une nouvelle mission. Quel est le titre de la mission ?",
        type: "job_creation",
        step: "title",
        sender: {
          id: "assistant",
          full_name: "Mr. Victaure"
        },
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      return true;
    }
    return false;
  }, []);

  const addMessage = useCallback((message: Partial<MessageType> & Pick<MessageType, 'role' | 'content'>) => {
    const fullMessage: MessageType = {
      id: crypto.randomUUID(),
      ...message,
      sender: {
        id: message.role === 'assistant' ? 'assistant' : 'user',
        full_name: message.role === 'assistant' ? 'Mr. Victaure' : 'You'
      },
      timestamp: new Date()
    };
    setMessages(prev => [...prev, fullMessage]);
  }, []);

  return {
    messages,
    sendMessage,
    handleJobResponse,
    isCreatingJob,
    inputMessage,
    setInputMessage,
    isThinking,
    handleVoiceInput,
    isListening
  };
}