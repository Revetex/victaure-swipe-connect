
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

      // Check if this is Mr. Victaure, allow conversation with special handling
      if (selectedReceiver.id === 'assistant') {
        // Get or create AI conversation thread
        const { data: existingMessages, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('is_ai_message', true)
          .order('created_at', { ascending: true });

        if (msgError) {
          console.error("Error fetching AI messages:", msgError);
          return;
        }

        if (!existingMessages || existingMessages.length === 0) {
          // Create initial welcome message if no conversation exists
          const { error: welcomeError } = await supabase
            .from('messages')
            .insert({
              content: "Bonjour ! Je suis M. Victaure, votre assistant personnel. Comment puis-je vous aider aujourd'hui ?",
              sender_id: 'assistant',
              receiver_id: user.id,
              is_ai_message: true
            });

          if (welcomeError) {
            console.error("Error creating welcome message:", welcomeError);
            return;
          }
        }

        setReceiver(selectedReceiver);
        setShowConversation(true);
        return;
      }

      // For other users, prevent conversation with yourself
      if (selectedReceiver.id === user.id) {
        toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même");
        return;
      }

      // Check if they are friends
      const { data: friendRequest, error: friendError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('status', 'accepted')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedReceiver.id}),and(sender_id.eq.${selectedReceiver.id},receiver_id.eq.${user.id})`)
        .single();

      if (friendError || !friendRequest) {
        toast.error("Vous devez être amis pour démarrer une conversation");
        return;
      }

      // Set the receiver and show conversation
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
