
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, DatabaseMessage, transformDatabaseMessage } from "@/types/messages";
import { toast } from "sonner";

export function useMessageQuery(receiverId?: string) {
  return useQuery({
    queryKey: ["messages", receiverId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("Non authentifié");

      try {
        let query = supabase
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
            message_type,
            sender:profiles!messages_sender_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            ),
            receiver:profiles!messages_receiver_id_fkey(
              id, full_name, avatar_url, online_status, last_seen
            )
          `)
          .order('created_at', { ascending: false });

        if (receiverId) {
          query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        }

        const { data: messages, error: queryError } = await query;

        if (queryError) throw queryError;

        return (messages || []).map(msg => transformDatabaseMessage(msg as DatabaseMessage));
      } catch (error) {
        console.error("Erreur chargement messages:", error);
        throw error;
      }
    },
    enabled: true
  });
}
