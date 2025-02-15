
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Receiver } from "@/types/messages";
import { toast } from "sonner";

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
            read,
            status,
            metadata,
            reaction,
            is_assistant,
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

        // Formater les conversations
        return (conversations || [])
          .filter(conv => {
            const partnerId = conv.sender_id === user.id ? conv.receiver_id : conv.sender_id;
            return !deletedIds.has(partnerId);
          })
          .map(conv => ({
            id: conv.id,
            content: conv.content,
            sender_id: conv.sender_id,
            receiver_id: conv.receiver_id,
            created_at: conv.created_at,
            updated_at: conv.created_at,
            read: conv.read || false,
            sender: conv.sender,
            receiver: conv.receiver,
            timestamp: conv.created_at,
            message_type: conv.is_assistant ? 'assistant' as const : 'user' as const,
            status: conv.status || 'sent',
            metadata: conv.metadata || {},
            reaction: conv.reaction,
            is_assistant: conv.is_assistant
          }));
      } catch (error) {
        console.error("Erreur chargement conversations:", error);
        throw error;
      }
    }
  });
}
