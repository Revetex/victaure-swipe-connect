
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageCleanup = () => {
  useEffect(() => {
    const cleanupMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Supprimer les conversations avec soi-même
        const { error: selfMessageError } = await supabase
          .from('messages')
          .delete()
          .match({ 
            sender_id: user.id,
            receiver_id: user.id 
          });

        if (selfMessageError) throw selfMessageError;

        // Supprimer les anciens messages de l'IA mal dirigés
        const { error: aiMessageError } = await supabase
          .from('messages')
          .delete()
          .eq('sender_id', 'assistant')
          .eq('receiver_id', user.id);

        if (aiMessageError) throw aiMessageError;

      } catch (error) {
        console.error('Error cleaning up messages:', error);
      }
    };

    cleanupMessages();
  }, []);
};
