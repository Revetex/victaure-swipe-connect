import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un message");
        return;
      }

      const { error } = await supabase
        .from('ai_chat_messages')
        .insert({
          content: message,
          user_id: user.id,
          sender: 'user'
        });

      if (error) throw error;

      setMessages(prev => [...prev, { content: message, sender: 'user' }]);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage
  };
}