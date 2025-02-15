
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

export function useMessageQuery() {
  const { data: { user } } = await supabase.auth.getUser();
  
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!user?.id) throw new Error("Non authentifié");

      try {
        // Récupérer d'abord les conversations existantes
        const { data: conversations, error: convError } = await supabase
          .from('messages')
          .select(`
            distinct on (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
            id,
            content,
            created_at,
            sender:profiles!messages_sender_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            ),
            receiver:profiles!messages_receiver_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            )
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .not('is_assistant', 'eq', true);

        if (convError) throw convError;

        // Récupérer les conversations supprimées
        const { data: deletedConvs } = await supabase
          .from('deleted_conversations')
          .select('conversation_partner_id')
          .eq('user_id', user.id)
          .eq('keep_pinned', false);

        const deletedIds = new Set(deletedConvs?.map(dc => dc.conversation_partner_id) || []);

        // Filtrer les conversations supprimées
        const activeConversations = conversations?.filter(conv => {
          const partnerId = conv.sender_id === user.id ? conv.receiver_id : conv.sender_id;
          return !deletedIds.has(partnerId);
        }) || [];

        return activeConversations;
      } catch (error) {
        console.error("Erreur chargement conversations:", error);
        throw error;
      }
    },
    staleTime: 30000,
    retry: 1
  });
}
