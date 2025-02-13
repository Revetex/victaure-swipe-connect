
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMarkAsRead(receiverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !receiverId) return;

      let query = supabase
        .from("messages")
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      // Si c'est une conversation avec l'assistant
      if (receiverId === 'assistant') {
        query = query.eq('is_assistant', true);
      } else {
        query = query.eq('sender_id', receiverId).eq('is_assistant', false);
      }

      const { error } = await query;

      if (error) {
        console.error("Error marking messages as read:", error);
        toast.error("Erreur lors du marquage des messages comme lus");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
    }
  });
}
