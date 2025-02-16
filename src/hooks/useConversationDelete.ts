
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
        const { error: deleteError } = await supabase.rpc(
          'mark_conversation_deleted',
          { 
            p_user_id: user.id,
            p_conversation_partner_id: receiver.id,
            p_keep_pinned: false
          }
        );

        if (deleteError) throw deleteError;

        // Rafraîchir les données
        await queryClient.invalidateQueries({ queryKey: ["conversations"] });
        await queryClient.invalidateQueries({ queryKey: ["messages", receiver.id] });
        
        toast.success("Conversation supprimée de votre liste");
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
