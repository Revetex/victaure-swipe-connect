
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
        // Delete AI conversation using the dedicated function
        const { error: aiError } = await supabase.rpc('delete_ai_conversation', {
          p_user_id: user.id
        });

        if (aiError) throw aiError;
        toast.success("Conversation avec l'assistant supprimée");
      } else {
        // Vérifier si l'autre utilisateur a déjà supprimé la conversation
        const { data: existingDeletion, error: fetchError } = await supabase
          .from('deleted_conversations')
          .select('*')
          .or(`user_id.eq.${receiver.id},conversation_partner_id.eq.${receiver.id}`)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // Si l'autre utilisateur a déjà supprimé la conversation
        if (existingDeletion) {
          const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

          if (messagesError) throw messagesError;

          const { error: deleteError } = await supabase
            .from('deleted_conversations')
            .delete()
            .or(`and(user_id.eq.${user.id},conversation_partner_id.eq.${receiver.id}),and(user_id.eq.${receiver.id},conversation_partner_id.eq.${user.id})`);

          if (deleteError) throw deleteError;

          toast.success("Conversation définitivement supprimée");
        } else {
          const { error: insertError } = await supabase
            .from('deleted_conversations')
            .upsert({
              user_id: user.id,
              conversation_partner_id: receiver.id
            });

          if (insertError) {
            if (insertError.code === '23505') { // Conflict error code
              toast.info("Cette conversation est déjà supprimée");
            } else {
              throw insertError;
            }
          } else {
            toast.success("Conversation supprimée de votre liste");
          }
        }
      }

      // Rafraîchir la liste des conversations
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
