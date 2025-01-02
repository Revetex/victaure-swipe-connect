import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { chatService } from "@/services/ai/chatService";
import { toast } from "sonner";

export function useChat() {
  const [messages, setMessages] = useState<Array<{ content: string; sender: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { user } = useAuth();

  const loadMessages = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const loadedMessages = await chatService.loadMessages(user.id);
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Impossible de charger les messages");
    }
  }, [user?.id]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return;

    const userMessage = { content, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      await chatService.saveMessage(user.id, content, "user");
      
      const aiResponse = await chatService.generateAIResponse([...messages, userMessage]);
      const assistantMessage = { content: aiResponse, sender: "assistant" };
      
      await chatService.saveMessage(user.id, aiResponse, "assistant");
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  }, [messages, user?.id]);

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
    if (!user?.id) return;
    setMessages([]);
    toast.success("Conversation effacée");
  }, [user?.id]);

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