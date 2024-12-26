import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateAIResponse } from "@/services/huggingFaceService";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  thinking?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "...",
      sender: "assistant",
      timestamp: new Date(),
      thinking: true,
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      setMessages((prev) => prev.filter(m => !m.thinking));
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => prev.filter(m => !m.thinking));
      
      toast({
        title: "Erreur",
        description: "Je ne peux pas répondre pour le moment. Veuillez réessayer dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La reconnaissance vocale n'est pas supportée sur votre navigateur.",
      });
      return;
    }

    try {
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = () => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la reconnaissance vocale.",
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation du microphone.",
      });
      setIsListening(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat effacé",
      description: "L'historique de conversation a été effacé.",
    });
  };

  return {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  };
}