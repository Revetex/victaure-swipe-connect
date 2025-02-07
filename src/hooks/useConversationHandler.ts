
import { useReceiver } from "@/hooks/useReceiver";
import { Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useConversationHandler = () => {
  const { setShowConversation, setReceiver } = useReceiver();

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
  };

  const handleSelectConversation = async (selectedReceiver: Receiver) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer des messages");
        return;
      }

      // Check if this is Mr. Victaure, allow conversation
      if (selectedReceiver.id === 'assistant') {
        setReceiver(selectedReceiver);
        setShowConversation(true);
        return;
      }

      // For other users, only prevent conversation with yourself
      if (selectedReceiver.id === user.id) {
        toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même");
        return;
      }

      // Check if they are friends
      const { data: friendRequest } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${selectedReceiver.id},receiver_id.eq.${selectedReceiver.id}`)
        .single();

      if (!friendRequest) {
        toast.error("Vous devez être amis pour démarrer une conversation");
        return;
      }

      // Allow conversation between friends
      setReceiver(selectedReceiver);
      setShowConversation(true);
      console.log("Starting conversation with:", selectedReceiver);

    } catch (error) {
      console.error('Error selecting conversation:', error);
      toast.error("Une erreur est survenue lors de la sélection de la conversation");
    }
  };

  return {
    handleBack,
    handleSelectConversation
  };
};
