import { useState, useEffect } from "react";
import { generateAIResponse } from "@/services/huggingFaceService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [deletedMessages, setDeletedMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // Load messages from Supabase on mount
  useEffect(() => {
    const loadMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "user" | "assistant",
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    };

    loadMessages();
  }, []);

  const saveMessage = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('ai_chat_messages')
        .insert({
          id: message.id,
          content: message.content,
          sender: message.sender,
          user_id: user.id,
          created_at: message.timestamp.toISOString(),
        });

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveMessage:', error);
      toast.error("Erreur lors de l'enregistrement du message");
      throw error;
    }
  };

  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    try {
      // Save user message
      const newUserMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newUserMessage]);
      await saveMessage(newUserMessage);
      setInputMessage("");
      setIsThinking(true);

      // Add thinking message
      const thinkingMessage: Message = {
        id: crypto.randomUUID(),
        content: "...",
        sender: "assistant",
        thinking: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // Generate AI response
      const response = await generateAIResponse(message, profile);
      
      if (!response) {
        throw new Error("No response from AI");
      }

      // Remove thinking message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== thinkingMessage.id);
        const newAssistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response,
          sender: "assistant",
          timestamp: new Date(),
        };
        return [...filtered, newAssistantMessage];
      });

      // Save assistant message
      const newAssistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };
      await saveMessage(newAssistantMessage);

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setMessages(prev => prev.filter(msg => !msg.thinking));
      toast.error("Désolé, je n'ai pas pu générer une réponse");
      setIsThinking(false);
      throw error;
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

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      setDeletedMessages(messages);

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing chat:', error);
        throw error;
      }

      setMessages([]);
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error('Error in clearChat:', error);
      toast.error("Erreur lors de l'effacement de la conversation");
      throw error;
    }
  };

  const restoreChat = async () => {
    if (deletedMessages.length === 0) {
      toast.error("Aucune conversation à restaurer");
      return;
    }

    try {
      for (const message of deletedMessages) {
        await saveMessage(message);
      }
      setMessages(deletedMessages);
      setDeletedMessages([]);
      toast.success("Conversation restaurée avec succès");
    } catch (error) {
      console.error('Error restoring chat:', error);
      toast.error("Erreur lors de la restauration de la conversation");
      throw error;
    }
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
    restoreChat,
  };
}