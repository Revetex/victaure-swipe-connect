
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receiver } from "@/types/messages";

export const useMessageReadStatus = (showConversation: boolean, receiver: Receiver | null) => {
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!receiver) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', receiver.id)
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (error) {
          console.error('Error marking messages as read:', error);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
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
