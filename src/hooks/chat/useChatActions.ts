import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useChatActions() {
  const [messages, setMessages] = useState<any[]>([]);

  const deleteConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { error } = await supabase
        .from('ai_chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMessages([]);
      toast.success("La conversation a été effacée");

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Impossible d'effacer la conversation");
    }
  };

  return {
    messages,
    setMessages,
    deleteConversation,
  };
}