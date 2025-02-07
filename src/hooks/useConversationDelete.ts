
import { supabase } from "@/integrations/supabase/client";
import { Receiver } from "@/types/messages";
import { toast } from "sonner";

export const useConversationDelete = (clearUserChat: (receiverId: string) => void) => {
  const handleDeleteConversation = async (receiver: Receiver | null) => {
    if (!receiver) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      if (receiver.id === 'assistant') {
        // Pour les messages AI
        const { error: aiMessagesError } = await supabase
          .from('messages')
          .delete()
          .eq('receiver_id', user.id)
          .eq('message_type', 'ai');

        if (aiMessagesError) throw aiMessagesError;
      } else {
        // Pour les messages entre utilisateurs
        const { error: userMessagesError } = await supabase
          .from('messages')
          .delete()
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
          .eq('message_type', 'user');

        if (userMessagesError) throw userMessagesError;
      }

      // Supprimer les statuts de messages pour cette conversation
      const { error: messageStatusError } = await supabase
        .from('message_status')
        .delete()
        .or(`user_id.eq.${user.id},user_id.eq.${receiver.id}`);

      if (messageStatusError) throw messageStatusError;

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
