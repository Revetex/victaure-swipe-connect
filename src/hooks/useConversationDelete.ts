
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

      if (receiver.id === 'assistant') {
        // Supprimer définitivement la conversation avec l'assistant
        const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .eq('receiver_id', user.id)
          .eq('is_assistant', true);

        if (deleteError) throw deleteError;
        
        // Supprimer la référence dans deleted_ai_conversations
        const { error: aiError } = await supabase
          .from('deleted_ai_conversations')
          .delete()
          .eq('user_id', user.id);

        if (aiError) throw aiError;
        
        toast.success("Conversation avec l'assistant supprimée définitivement");
      } else {
        // Supprimer définitivement les messages
        const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

        if (deleteError) throw deleteError;

        // Supprimer les références dans deleted_conversations
        const { error: markError } = await supabase
          .from('deleted_conversations')
          .delete()
          .eq('user_id', user.id)
          .eq('conversation_partner_id', receiver.id);

        if (markError) throw markError;
        
        toast.success("Conversation définitivement supprimée");
      }

      // Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({ queryKey: ["messages", receiver.id] });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
