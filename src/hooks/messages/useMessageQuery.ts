
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
          ),
          receiver:profiles!messages_receiver_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen
          ),
          message_deliveries!inner(
            status,
            delivered_at,
            read_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PER_PAGE);

      if (lastCursor) {
        query = query.lt('created_at', lastCursor);
      }

      if (receiver) {
        if (receiver.id === 'assistant') {
          // Pour les messages AI uniquement
          query = query
            .eq('receiver_id', user.id)
            .eq('is_assistant', true);
        } else {
          // Pour les messages entre utilisateurs uniquement
          query = query
            .eq('is_assistant', false)
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);
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
        status: msg.message_deliveries?.[0]?.status || msg.status || 'sent',
        message_type: msg.is_assistant ? 'assistant' : 'user',
        metadata: msg.metadata || {},
        sender: msg.is_assistant ? {
          id: 'assistant',
          full_name: 'M. Victaure',
          avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
          online_status: true,
          last_seen: new Date().toISOString()
        } : (msg.sender || {
          id: msg.sender_id,
          full_name: 'Unknown User',
          avatar_url: '',
          online_status: false,
          last_seen: new Date().toISOString()
        }),
        receiver: msg.receiver || {
          id: msg.receiver_id,
          full_name: 'Unknown User',
          avatar_url: '',
          online_status: false,
          last_seen: new Date().toISOString()
        }
      })) as Message[] || [];
    },
    enabled: true,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5 // 5 minutes
  });
}
