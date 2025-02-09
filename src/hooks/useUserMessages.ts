
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/messages";
import { useEffect } from "react";

export function useUserMessages(conversationId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["user_messages", conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["user_messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }

      return data as Message[];
    },
    enabled: !!conversationId
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, receiverId }: { content: string, receiverId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, ensure we have a conversation
      let convId = conversationId;
      if (!convId) {
        const { data: conv } = await supabase
          .from('user_conversations')
          .select('id')
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiverId}),and(participant1_id.eq.${receiverId},participant2_id.eq.${user.id})`)
          .maybeSingle();

        if (!conv) {
          const { data: newConv, error: convError } = await supabase
            .from('user_conversations')
            .insert({
              participant1_id: user.id,
              participant2_id: receiverId,
              status: 'active'
            })
            .select()
            .single();

          if (convError) throw convError;
          convId = newConv.id;
        } else {
          convId = conv.id;
        }
      }

      // Now send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: user.id,
          receiver_id: receiverId,
          conversation_id: convId,
          message_type: 'user'
        });

      if (messageError) {
        console.error("Error sending message:", messageError);
        toast.error("Erreur lors de l'envoi du message");
        throw messageError;
      }

      // Update conversation's last message
      const { error: updateError } = await supabase
        .from('user_conversations')
        .update({
          last_message: content,
          last_message_time: new Date().toISOString()
        })
        .eq('id', convId);

      if (updateError) {
        console.error("Error updating conversation:", updateError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["user_conversations"] });
    }
  });

  return {
    messages,
    isLoading,
    sendMessage
  };
}
