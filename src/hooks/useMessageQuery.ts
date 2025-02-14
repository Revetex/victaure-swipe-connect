
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

export interface UseMessageQueryOptions {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Erreur d'authentification:", authError);
        throw new Error("Erreur d'authentification");
      }

      if (!user) {
        throw new Error("Non authentifié");
      }

      if (!receiver) {
        return [];
      }

      try {
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

        if (receiver.id === 'assistant') {
          query = query
            .eq('receiver_id', user.id)
            .eq('is_assistant', true);
        } else {
          query = query
            .eq('is_assistant', false)
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);
        }

        const { data: messages, error: queryError } = await query;

        if (queryError) {
          console.error("Erreur de requête:", queryError);
          throw queryError;
        }

        if (!messages) {
          return [];
        }

        return messages.map(msg => ({
          ...msg,
          timestamp: msg.created_at,
          status: msg.status || 'sent',
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
        })) as Message[];
      } catch (error) {
        console.error("Erreur chargement messages:", error);
        throw error;
      }
    },
    enabled: !!receiver && hasMore,
    staleTime: options.staleTime || 1000 * 30,
    gcTime: options.cacheTime || 1000 * 60 * 5,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    retry: (failureCount, error) => {
      console.error(`Tentative ${failureCount} échouée:`, error);
      return failureCount < 3;
    }
  });
}
