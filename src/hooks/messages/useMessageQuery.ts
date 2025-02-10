
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
        query = query.lt('created_at', lastCursor);
      }

      if (receiver) {
        if (receiver.id === 'assistant') {
          // For AI messages, use is_assistant flag instead of sender_id
          query = query
            .eq('receiver_id', user.id)
            .eq('is_assistant', true);
        } else {
          // For user messages
          query = query
            .eq('is_assistant', false)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .eq(user.id === receiver.id ? 'sender_id' : 'receiver_id', receiver.id);
        }
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
        message_type: msg.is_assistant ? 'ai' : 'user',
        metadata: msg.metadata || {}
      })) as Message[] || [];
    },
    enabled: true
  });
}
