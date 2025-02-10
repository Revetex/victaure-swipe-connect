
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

        // First update the messages table
        const { error: messagesError } = await supabase
          .from('messages')
          .update({ 
            status: 'read',
            updated_at: new Date().toISOString()
          })
          .eq('sender_id', receiver.id)
          .eq('receiver_id', user.id)
          .neq('status', 'read');

        if (messagesError) {
          console.error('Error marking messages as read:', messagesError);
          return;
        }

        // Message deliveries will be automatically updated via trigger
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
