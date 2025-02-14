
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

interface UseMessageQueryOptions {
  staleTime?: number;
  cacheTime?: number;
}

export function useMessageQuery(
  receiver: Receiver | null, 
  lastCursor: string | null, 
  hasMore: boolean,
  options: UseMessageQueryOptions = {}
) {
  return useQuery({
    queryKey: ["messages", receiver?.id, lastCursor],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

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
            )
          `)
          .order('created_at', { ascending: false })
          .limit(MESSAGES_PER_PAGE);

        if (lastCursor) {
          query = query.lt('created_at', lastCursor);
        }

        if (receiver) {
          if (receiver.id === 'assistant') {
            query = query
              .eq('receiver_id', user.id)
              .eq('is_assistant', true);
          } else {
            query = query
              .eq('is_assistant', false)
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);
          }
        }

        const { data: messages, error } = await query;

        if (error) throw error;

        return messages?.map(msg => ({
          ...msg,
          timestamp: msg.created_at,
          status: msg.message_deliveries?.[0]?.status || msg.status || 'sent',
          message_type: msg.is_assistant ? 'assistant' : 'user',
          metadata: msg.metadata || {},
          sender: msg.sender || {
            id: msg.sender_id,
            full_name: 'Utilisateur inconnu',
            avatar_url: '',
            online_status: false,
            last_seen: new Date().toISOString()
          },
          receiver: msg.receiver || receiver
        })) as Message[] || [];
      } catch (error) {
        console.error("Erreur chargement messages:", error);
        toast.error("Erreur lors du chargement des messages");
        return [];
      }
    },
    enabled: !!receiver,
    staleTime: options.staleTime || 1000 * 30, // 30 secondes par défaut
    gcTime: options.cacheTime || 1000 * 60 * 5, // 5 minutes par défaut
    retry: 1, // Limite les tentatives de nouvelle requête en cas d'échec
  });
}
