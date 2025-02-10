
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMarkAsRead(receiverId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) {
        console.error("Error marking message as read:", error);
        toast.error("Erreur lors du marquage du message comme lu");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
    }
  });
}
