
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageCleanup = () => {
  useEffect(() => {
    const cleanupMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Call our new cleanup function
        const { error } = await supabase.rpc('cleanup_old_data');
        if (error) throw error;

        // For immediate cleanup, we'll also delete local messages
        const { error: messagesError } = await supabase
          .from('messages')
          .delete()
          .eq('sender_id', user.id);

        if (messagesError) throw messagesError;

        // Delete notifications
        const { error: notificationsError } = await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id);

        if (notificationsError) throw notificationsError;

        // Delete message statuses
        const { error: messageStatusError } = await supabase
          .from('message_status')
          .delete()
          .eq('user_id', user.id);

        if (messageStatusError) throw messageStatusError;

        // Delete AI chat messages
        const { error: aiMessagesError } = await supabase
          .from('ai_chat_messages')
          .delete()
          .eq('user_id', user.id);

        if (aiMessagesError) throw aiMessagesError;

        toast.success("Toutes les données ont été supprimées définitivement");
      } catch (error) {
        console.error('Error cleaning up data:', error);
        toast.error("Erreur lors de la suppression des données");
      }
    };

    cleanupMessages();
  }, []);
};
