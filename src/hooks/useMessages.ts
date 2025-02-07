
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/messages";
import { useReceiver } from "./useReceiver";

export function useMessages() {
  const queryClient = useQueryClient();
  const { receiver } = useReceiver();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", receiver?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen
          )
        `);

      // Handle AI messages differently
      if (receiver?.id === 'assistant') {
        query = query
          .eq('receiver_id', user.id)
          .eq('is_ai_message', true);
      } else {
        query = query
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver?.id}),and(sender_id.eq.${receiver?.id},receiver_id.eq.${user.id})`)
          .eq('is_ai_message', false);
      }

      const { data: messages, error } = await query.order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }

      return messages.map(msg => ({
        ...msg,
        timestamp: msg.created_at
      })) as Message[];
    },
    enabled: !!receiver
  });

  const markAsRead = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["messages", receiver?.id] });
    }
  });

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        console.error("Error deleting message:", error);
        toast.error("Erreur lors de la suppression du message");
        throw error;
      }
      toast.success("Message supprimé avec succès");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiver?.id] });
    }
  });

  return {
    messages,
    isLoading,
    markAsRead,
    deleteMessage
  };
}
