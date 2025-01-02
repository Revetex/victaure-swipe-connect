import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { chatService } from "@/services/ai/chatService";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadMessages = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const loadedMessages = await chatService.loadMessages();
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Impossible de charger les messages");
    }
  }, [isAuthenticated]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!isAuthenticated || !content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      await chatService.saveMessage(content, "user");
      
      const aiResponse = await chatService.generateAIResponse(content);
      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      await chatService.saveMessage(aiResponse, "assistant");
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  }, [isAuthenticated]);

  const handleVoiceInput = useCallback(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      toast.error("Erreur lors de la reconnaissance vocale");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [handleSendMessage]);

  const clearChat = useCallback(async () => {
    if (!isAuthenticated) return;
    setMessages([]);
    toast.success("Conversation effacée");
  }, [isAuthenticated]);

  return {
    messages,
    inputMessage,
    isThinking,
    isListening,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
    loadMessages,
  };
}