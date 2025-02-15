
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
        // Supprimer la conversation avec l'assistant
        const { error: aiError } = await supabase.rpc('delete_ai_conversation', {
          p_user_id: user.id
        });

        if (aiError) throw aiError;
        toast.success("Conversation avec l'assistant réinitialisée");
      } else {
        // Pour les conversations entre utilisateurs
        const { data: existingDeletion } = await supabase
          .from('deleted_conversations')
          .select('*')
          .eq('user_id', receiver.id)
          .eq('conversation_partner_id', user.id)
          .single();

        if (existingDeletion) {
          // Si l'autre utilisateur a déjà supprimé la conversation, supprimer les messages
          await supabase
            .from('messages')
            .delete()
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

          await supabase
            .from('deleted_conversations')
            .delete()
            .or(`and(user_id.eq.${user.id},conversation_partner_id.eq.${receiver.id}),and(user_id.eq.${receiver.id},conversation_partner_id.eq.${user.id})`);

          toast.success("Conversation définitivement supprimée");
        } else {
          // Marquer la conversation comme supprimée pour cet utilisateur
          await supabase
            .from('deleted_conversations')
            .insert({
              user_id: user.id,
              conversation_partner_id: receiver.id,
              keep_pinned: false
            });

          toast.success("Conversation supprimée de votre liste");
        }
      }

      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", receiver.id] });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
