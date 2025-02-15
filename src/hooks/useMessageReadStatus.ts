
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";

export const useMessageReadStatus = (showConversation: boolean, receiver: Receiver | null) => {
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!receiver) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let query = supabase
          .from('messages')
          .update({ read: true, updated_at: new Date().toISOString() })
          .eq('receiver_id', user.id)
          .eq('read', false);

        // Si le receiver est l'assistant, utiliser is_assistant
        if (receiver.id === 'assistant') {
          query = query.eq('is_assistant', true);
        } else {
          // Sinon, utiliser sender_id pour les messages normaux
          query = query.eq('sender_id', receiver.id)
            .eq('is_assistant', false);
        }

        const { error: messagesError } = await query;

        if (messagesError) {
          console.error('Error marking messages as read:', messagesError);
          return;
        }

        console.log('Messages marked as read for receiver:', receiver.id);

      } catch (error) {
        console.error('Error in markMessagesAsRead:', error);
        toast.error("Erreur lors de la mise à jour des messages");
      }
    };

    let timeoutId: number;
    if (showConversation && receiver) {
      timeoutId = window.setTimeout(markMessagesAsRead, 500);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [showConversation, receiver]);
};
