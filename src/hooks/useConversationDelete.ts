
import { supabase } from "@/integrations/supabase/client";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useConversationDelete = () => {
  const queryClient = useQueryClient();

  const handleDeleteConversation = async (receiver: Receiver | null) => {
    if (!receiver) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      // Mark conversation as deleted using our new function
      const { error: markError } = await supabase.rpc('mark_conversation_deleted', {
        p_user_id: user.id,
        p_conversation_partner_id: receiver.id
      });

      if (markError) throw markError;

      // Check if other user has also deleted the conversation
      const { data: partnerDeleted } = await supabase
        .from('deleted_conversations')
        .select('id')
        .eq('user_id', receiver.id)
        .eq('conversation_partner_id', user.id)
        .single();

      if (partnerDeleted) {
        // Both users have deleted, permanently remove messages
        if (receiver.id === 'assistant') {
          const { error: aiMessagesError } = await supabase
            .from('messages')
            .delete()
            .eq('receiver_id', user.id)
            .eq('message_type', 'ai');

          if (aiMessagesError) throw aiMessagesError;
        } else {
          const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

          if (messagesError) throw messagesError;
        }

        toast.success("Conversation définitivement supprimée");
      } else {
        toast.success("Conversation supprimée de votre liste");
      }

      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
