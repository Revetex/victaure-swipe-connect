import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Add user message
      const userMessageId = uuidv4();
      const userMessage = {
        id: userMessageId,
        content,
        user_id: user.id,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsThinking(true);

      // Save user message to database
      const { error: saveError } = await supabase
        .from('ai_chat_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Get AI response
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-agents', {
        body: { 
          action: 'handle_message',
          message: content,
          userId: user.id
        }
      });

      if (aiError) throw aiError;

      // Add AI response
      const aiMessageId = uuidv4();
      const aiMessage = {
        id: aiMessageId,
        content: aiResponse.response,
        user_id: user.id,
        sender: 'assistant',
        timestamp: new Date(),
      };

      // Save AI message to database
      const { error: saveAiError } = await supabase
        .from('ai_chat_messages')
        .insert(aiMessage);

      if (saveAiError) throw saveAiError;

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
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
      console.error('Error clearing chat:', error);
      toast.error("Erreur lors de l'effacement");
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    inputMessage,
    setInputMessage,
    isListening,
    isThinking,
    sendMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  };
}