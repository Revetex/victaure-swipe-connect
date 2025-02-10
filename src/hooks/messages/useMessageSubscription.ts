
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";
import { useMessagesStore } from "@/store/messagesStore";

export function useMessageSubscription() {
  const { addMessage, updateMessage, deleteMessage } = useMessagesStore();

  useEffect(() => {
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            addMessage(newMessage);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            updateMessage(updatedMessage);
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            deleteMessage(deletedMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addMessage, updateMessage, deleteMessage]);
}
