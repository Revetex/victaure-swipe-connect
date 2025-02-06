
import { supabase } from "@/integrations/supabase/client";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";

export const useConversationDelete = (clearUserChat: (receiverId: string) => void) => {
  const handleDeleteConversation = async (receiver: Receiver | null) => {
    if (!receiver) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      // Supprimer les messages de la conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

      if (messagesError) throw messagesError;

      // Supprimer les notifications liées à cette conversation
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .or(`message.ilike.%${receiver.id}%,message.ilike.%${user.id}%`);

      if (notificationsError) throw notificationsError;
      
      clearUserChat(receiver.id);
      toast.success(`Conversation avec ${receiver.full_name} supprimée définitivement`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return { handleDeleteConversation };
};
