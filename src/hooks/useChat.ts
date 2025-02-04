import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/messages";
import { initializeSpeechRecognition } from "@/services/speechRecognitionService";
import { v4 as uuidv4 } from "uuid";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const messageId = uuidv4();
    const timestamp = new Date().toISOString();

    const newMessage: Message = {
      id: messageId,
      content,
      sender: 'user',
      sender_id: user.id,
      receiver_id: 'assistant',
      read: true,
      created_at: timestamp,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    const { error } = await supabase
      .from("ai_chat_messages")
      .insert({
        id: messageId,
        user_id: user.id,
        content,
        sender: 'user',
        created_at: timestamp
      });

    if (error) throw error;
    return newMessage;
  };

  const handleSendMessage = useCallback(async (message: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour utiliser le chat");
        return;
      }

      setIsThinking(true);
      await sendMessage(message);
      setInputMessage("");

      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message,
          userId: session.user.id,
          context: {
            previousMessages: messages.slice(-5),
          }
        }
      });

      if (aiError) throw aiError;

      if (aiResponse?.response) {
        const messageId = uuidv4();
        const timestamp = new Date().toISOString();
        
        const assistantMessage: Message = {
          id: messageId,
          content: aiResponse.response,
          sender: 'assistant',
          sender_id: 'assistant',
          receiver_id: session.user.id,
          read: true,
          created_at: timestamp,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        const { error: insertError } = await supabase
          .from("ai_chat_messages")
          .insert({
            id: messageId,
            user_id: session.user.id,
            content: aiResponse.response,
            sender: 'assistant',
            created_at: timestamp
          });

        if (insertError) throw insertError;
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  }, [messages]);

  const handleVoiceInput = useCallback(() => {
    try {
      setIsListening(true);
      const recognition = initializeSpeechRecognition(setIsListening, setInputMessage);
      if (recognition) {
        recognition.start();
      } else {
        toast.error("La reconnaissance vocale n'est pas disponible sur votre navigateur");
      }
    } catch (error) {
      console.error("Error in handleVoiceInput:", error);
      toast.error("Une erreur est survenue avec l'entrée vocale");
      setIsListening(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("ai_chat_messages")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setMessages([]);
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Une erreur est survenue lors de l'effacement du chat");
    }
  }, []);

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