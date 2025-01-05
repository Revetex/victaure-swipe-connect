import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateAIResponse, loadMessages, saveMessage } from "@/services/ai/service";

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    loadInitialMessages();
  }, []);

  const loadInitialMessages = async () => {
    try {
      const savedMessages = await loadMessages();
      setMessages(savedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erreur lors du chargement des messages");
    }
  };

  const handleSendMessage = async (content: string, profile: any) => {
    try {
      if (!content.trim()) return;

      // Create and save user message
      const userMessageId = uuidv4();
      const userMessage = {
        id: userMessageId,
        content,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsThinking(true);

      await saveMessage(userMessage);

      // Get AI response
      const aiResponse = await generateAIResponse(content);
      
      // Create and save AI message
      const aiMessageId = uuidv4();
      const aiMessage = {
        id: aiMessageId,
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveMessage(aiMessage);

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Désolé, il y a eu une erreur. Essayez encore!");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice input logic if needed
  };

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      setMessages([]);
      toast.success("Conversation effacée");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  };
}
