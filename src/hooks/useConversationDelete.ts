
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
        const { error: deleteError } = await supabase
          .from('ai_messages')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        toast.success("Conversation avec l'assistant supprimée");
      } else {
        // Supprimer définitivement les messages entre utilisateurs
        const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (deleteError) throw deleteError;
        toast.success("Conversation supprimée définitivement");
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
