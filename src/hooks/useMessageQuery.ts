
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

export function useMessageQuery() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Non authentifié");

      try {
        const { data: conversations, error: convError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
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

        // Filtrer les conversations supprimées et formater les données
        const activeConversations = conversations?.filter(conv => {
          const partnerId = conv.sender_id === user.id ? conv.receiver_id : conv.sender_id;
          return !deletedIds.has(partnerId);
        }).map(conv => ({
          id: conv.id,
          content: conv.content,
          created_at: conv.created_at,
          sender: conv.sender,
          receiver: conv.receiver,
          message_type: 'user' as const,
          timestamp: conv.created_at
        })) || [];

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
