
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useConversationHandler = () => {
  const findExistingConversation = async (userId: string, partnerId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant1_id.eq.${userId},participant1_id.eq.${partnerId}`)
      .or(`participant2_id.eq.${userId},participant2_id.eq.${partnerId}`)
      .maybeSingle();

    if (error) throw error;
    return data;
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

          if (updateError) throw updateError;
        }
        return existingConversation;
      }

      // Si aucune conversation n'existe, en créer une nouvelle
      const participants = [userId, partnerId].sort(); // Tri pour assurer la cohérence
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: participants[0],
          participant2_id: participants[1],
          ...(lastMessage ? {
            last_message: lastMessage,
            last_message_time: new Date().toISOString()
          } : {})
        })
        .select()
        .single();

      if (createError) {
        // En cas d'erreur de duplication, réessayer de trouver la conversation
        if (createError.code === '23505') {
          const retryConversation = await findExistingConversation(userId, partnerId);
          if (retryConversation) return retryConversation;
        }
        throw createError;
      }

      return newConversation;
    } catch (error: any) {
      console.error("Error in createOrUpdateConversation:", error);
      throw error;
    }
  };

  const sendMessage = async (content: string, senderId: string, receiverId: string) => {
    try {
      const conversation = await createOrUpdateConversation(senderId, receiverId, content);
      if (!conversation) {
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

      if (messageError) throw messageError;
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
