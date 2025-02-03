import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/messages";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("ai_chat_messages")
      .insert({
        user_id: user.id,
        content,
        sender: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const handleSendMessage = async (message: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour utiliser le chat");
        return;
      }

      setIsThinking(true);
      await sendMessage(message);
      setInputMessage("");

      // Fetch AI response
      const { data: aiResponse, error: aiError } = await supabase
        .functions.invoke('ai-chat', {
          body: { message }
        });

      if (aiError) throw aiError;

      if (aiResponse?.message) {
        const { error: insertError } = await supabase
          .from("ai_chat_messages")
          .insert({
            user_id: session.user.id,
            content: aiResponse.message,
            sender: 'assistant'
          });

        if (insertError) throw insertError;
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceInput = () => {
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
  };

  const clearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("ai_chat_messages")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Une erreur est survenue lors de l'effacement du chat");
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
