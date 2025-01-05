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

      const messageId = uuidv4();
      const message = {
        id: messageId,
        content,
        user_id: user.id,
        sender: 'user'
      };

      const { error } = await supabase
        .from('ai_chat_messages')
        .insert(message);

      if (error) throw error;

      setMessages(prev => [...prev, message]);
      setInputMessage("");
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
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