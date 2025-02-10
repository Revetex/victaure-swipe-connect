
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, Receiver } from "@/types/messages";

const MESSAGES_PER_PAGE = 20;

export function useMessageQuery(receiver: Receiver | null, lastCursor: string | null, hasMore: boolean) {
  return useQuery({
    queryKey: ["messages", receiver?.id, lastCursor],
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
        `)
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PER_PAGE);

      if (lastCursor) {
        query = query.lt('page_cursor', lastCursor);
      }

      if (receiver?.id === 'assistant') {
        query = query
          .eq('receiver_id', user.id)
          .eq('message_type', 'ai');
      } else if (receiver) {
        query = query.or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),` +
          `and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`
        ).eq('message_type', 'user');
      }

      const { data: messages, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }

      return messages?.map(msg => ({
        ...msg,
        timestamp: msg.created_at,
        status: msg.read ? 'read' : 'delivered',
        message_type: (msg.message_type || 'user') as Message['message_type'],
        metadata: (msg.metadata || {}) as Record<string, any>
      })) as Message[] || [];
    },
    enabled: true
  });
}
