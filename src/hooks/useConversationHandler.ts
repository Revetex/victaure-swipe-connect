
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useConversationHandler = () => {
  const findExistingConversation = async (userId: string, partnerId: string) => {
    try {
      // On cherche la conversation dans les deux sens possibles
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant1_id.eq.${userId},participant2_id.eq.${partnerId}),and(participant1_id.eq.${partnerId},participant2_id.eq.${userId})`)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error finding conversation:", error);
      return null;
    }
  };

  const createOrUpdateConversation = async (userId: string, partnerId: string, lastMessage?: string) => {
    try {
      // D'abord, chercher une conversation existante
      const existingConversation = await findExistingConversation(userId, partnerId);

      if (existingConversation) {
        // Si on a un nouveau message, mettre à jour la conversation
        if (lastMessage) {
          const { error: updateError } = await supabase
            .from('conversations')
            .update({
              last_message: lastMessage,
              last_message_time: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingConversation.id);

          if (updateError) {
            console.error("Error updating conversation:", updateError);
            toast.error("Erreur lors de la mise à jour de la conversation");
            throw updateError;
          }
        }
        return existingConversation;
      }

      // Les IDs doivent être triés pour maintenir la cohérence
      const [participant1_id, participant2_id] = [userId, partnerId].sort();

      // Si aucune conversation n'existe, en créer une nouvelle
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id,
          participant2_id,
          last_message: lastMessage || '',
          last_message_time: lastMessage ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        // En cas d'erreur de duplication, réessayer de trouver la conversation
        if (createError.code === '23505') {
          const retryConversation = await findExistingConversation(userId, partnerId);
          if (retryConversation) return retryConversation;
        }
        console.error("Error creating conversation:", createError);
        toast.error("Erreur lors de la création de la conversation");
        throw createError;
      }

      return newConversation;
    } catch (error) {
      console.error("Error in createOrUpdateConversation:", error);
      throw error;
    }
  };

  const sendMessage = async (content: string, senderId: string, receiverId: string) => {
    try {
      const conversation = await createOrUpdateConversation(senderId, receiverId, content);
      if (!conversation) {
        toast.error("Impossible de créer ou trouver la conversation");
        throw new Error("Impossible de créer ou trouver la conversation");
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: senderId,
          receiver_id: receiverId,
          conversation_id: conversation.id,
          is_assistant: false,
          message_type: 'user',
          status: 'sent',
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'chat'
          }
        });

      if (messageError) {
        console.error("Error sending message:", messageError);
        toast.error("Erreur lors de l'envoi du message");
        throw messageError;
      }

      toast.success("Message envoyé");
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  return {
    findExistingConversation,
    createOrUpdateConversation,
    sendMessage
  };
};
