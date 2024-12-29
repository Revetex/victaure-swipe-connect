import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  action?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: uuidv4(),
    content: "Bonjour ! Je suis Mr Victaure, votre assistant IA. Je peux vous aider à mettre à jour votre profil. Souhaitez-vous commencer ?",
    sender: "assistant",
    timestamp: new Date(),
    action: 'greeting'
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.sender,
            content: msg.content,
            action: msg.action
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.choices[0].message.content,
        sender: "assistant",
        timestamp: new Date(),
        action: data.choices[0].message.action
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (assistantMessage.action === 'update_complete') {
        toast.success("Votre profil a été mis à jour avec succès !");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Désolé, je n'ai pas pu répondre. Veuillez réessayer.");
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
    setMessages([{
      id: uuidv4(),
      content: "Bonjour ! Je suis Mr Victaure, votre assistant IA. Comment puis-je vous aider aujourd'hui ?",
      sender: "assistant",
      timestamp: new Date(),
    }]);
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