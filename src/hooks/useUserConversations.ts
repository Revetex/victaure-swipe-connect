
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

interface UserConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  status: 'active' | 'archived' | 'blocked';
  last_message: string | null;
  last_message_time: string;
  participant1_last_read: string | null;
  participant2_last_read: string | null;
  created_at: string;
  updated_at: string;
  participant1: Profile;
  participant2: Profile;
}

export function useUserConversations() {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["user_conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('user_conversations')
        .select(`
          *,
          participant1:profiles!user_conversations_participant1_id_fkey(*),
          participant2:profiles!user_conversations_participant2_id_fkey(*)
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Erreur lors du chargement des conversations");
        throw error;
      }

      return data as UserConversation[];
    }
  });

  const createConversation = useMutation({
    mutationFn: async (participantId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('user_conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${user.id})`)
        .maybeSingle();

      if (existingConv) {
        return existingConv.id;
      }

      const { data, error } = await supabase
        .from('user_conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating conversation:", error);
        toast.error("Erreur lors de la création de la conversation");
        throw error;
      }

      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_conversations"] });
    }
  });

  const updateConversationStatus = useMutation({
    mutationFn: async ({ conversationId, status }: { conversationId: string, status: 'active' | 'archived' | 'blocked' }) => {
      const { error } = await supabase
        .from('user_conversations')
        .update({ status })
        .eq('id', conversationId);

      if (error) {
        console.error("Error updating conversation status:", error);
        toast.error("Erreur lors de la mise à jour du statut");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_conversations"] });
    }
  });

  const markConversationAsRead = useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .rpc('mark_user_messages_as_read', {
          conversation_id: conversationId
        });

      if (error) {
        console.error("Error marking conversation as read:", error);
        toast.error("Erreur lors du marquage comme lu");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_conversations"] });
    }
  });

  return {
    conversations,
    isLoading,
    createConversation,
    updateConversationStatus,
    markConversationAsRead
  };
}
