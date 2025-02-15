
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

export function useConversationMessages(receiver: Receiver | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["messages", receiver?.id],
    queryFn: async () => {
      if (!receiver) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      try {
        let query = supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(*),
            receiver:profiles!messages_receiver_id_fkey(*)
          `)
          .order('created_at', { ascending: false });

        if (receiver.id === 'assistant') {
          query = query
            .eq('receiver_id', user.id)
            .eq('is_assistant', true);
        } else {
          query = query
            .eq('is_assistant', false)
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(msg => ({
          ...msg,
          timestamp: msg.created_at,
          message_type: msg.is_assistant ? 'assistant' : 'user',
          metadata: msg.metadata || {}
        }));
      } catch (error) {
        console.error("Erreur chargement messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }
    },
    enabled: !!receiver,
    staleTime: 1000 * 30
  });
}
