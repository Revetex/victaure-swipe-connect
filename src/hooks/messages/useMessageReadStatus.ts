
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

        // Update messages to mark them as read
        const { error: messagesError } = await supabase
          .from('messages')
          .update({ 
            read: true,
            message_state: 'read',
            updated_at: new Date().toISOString()
          })
          .eq('sender_id', receiver.id)
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (messagesError) {
          console.error('Error marking messages as read:', messagesError);
          toast.error("Erreur lors du marquage des messages comme lus");
          return;
        }

        // Update message_deliveries to reflect read status
        const { error: deliveriesError } = await supabase
          .from('message_deliveries')
          .update({
            status: 'read',
            read_at: new Date().toISOString()
          })
          .eq('recipient_id', user.id)
          .is('read_at', null);

        if (deliveriesError) {
          console.error('Error updating message deliveries:', deliveriesError);
        }

      } catch (error) {
        console.error('Error in markMessagesAsRead:', error);
        toast.error("Une erreur est survenue");
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
