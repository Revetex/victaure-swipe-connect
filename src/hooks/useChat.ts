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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('ai_chat_messages')
      .insert([{
        content: message.content,
        sender: message.sender,
        user_id: user.id,
        created_at: message.timestamp.toISOString(),
      }]);

    if (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = async (message: string, profile?: any) => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    await saveMessage(newUserMessage);
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
      await saveMessage(newAssistantMessage);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Désolé, je n'ai pas pu générer une réponse");
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing chat:', error);
      throw error;
    }

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