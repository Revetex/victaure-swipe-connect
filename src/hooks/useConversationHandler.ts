
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

      // Si c'est M. Victaure, autoriser la conversation
      if (selectedReceiver.id === 'assistant') {
        setReceiver(selectedReceiver);
        setShowConversation(true);
        return;
      }

      // Pour les autres utilisateurs, empêcher uniquement la conversation avec soi-même
      if (selectedReceiver.id === user.id) {
        toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même");
        return;
      }

      // Autoriser la conversation avec d'autres utilisateurs
      setReceiver(selectedReceiver);
      setShowConversation(true);
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
