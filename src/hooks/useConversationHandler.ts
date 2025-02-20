
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useConversationHandler = () => {
  const findExistingConversation = async (userId: string, partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)
        `)
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .or(`participant1_id.eq.${partnerId},participant2_id.eq.${partnerId}`)
        .single();

      if (error) {
        console.error("Error finding conversation:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in findExistingConversation:", error);
      return null;
    }
  };

  const createOrUpdateConversation = async (userId: string, partnerId: string, lastMessage?: string) => {
    try {
      console.log("Creating/updating conversation between", userId, "and", partnerId);
      
      // D'abord, chercher une conversation existante
      const existingConversation = await findExistingConversation(userId, partnerId);

      if (existingConversation) {
        console.log("Found existing conversation:", existingConversation.id);
        
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
            return existingConversation;
          }
        }
        return existingConversation;
      }

      console.log("No existing conversation found, creating new one");

      // Les IDs doivent être triés pour maintenir la cohérence
      const [participant1_id, participant2_id] = [userId, partnerId].sort();

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
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (createError) {
        if (createError.code === '23505') {
          console.log("Duplicate conversation detected, retrying find");
          const retryConversation = await findExistingConversation(userId, partnerId);
          if (retryConversation) return retryConversation;
        }
        console.error("Error creating conversation:", createError);
        toast.error("Erreur lors de la création de la conversation");
        throw createError;
      }

      console.log("New conversation created:", newConversation?.id);
      return newConversation;
    } catch (error) {
      console.error("Error in createOrUpdateConversation:", error);
      throw error;
    }
  };

  const sendMessage = async (content: string, senderId: string, receiverId: string) => {
    console.log("Sending message from", senderId, "to", receiverId);
    
    try {
      if (!content.trim()) {
        toast.error("Le message ne peut pas être vide");
        return;
      }

      const conversation = await createOrUpdateConversation(senderId, receiverId, content);
      
      if (!conversation) {
        console.error("No conversation found or created");
        toast.error("Impossible de créer ou trouver la conversation");
        return;
      }

      console.log("Sending message in conversation:", conversation.id);

      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: senderId,
          receiver_id: receiverId,
          conversation_id: conversation.id,
          is_assistant: false,
          message_type: 'user',
          status: 'sent',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'chat'
          }
        })
        .select()
        .single();

      if (messageError) {
        console.error("Error sending message:", messageError);
        toast.error("Erreur lors de l'envoi du message");
        throw messageError;
      }

      console.log("Message sent successfully:", message?.id);
      toast.success("Message envoyé");
      
      return message;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Erreur lors de l'envoi du message");
      throw error;
    }
  };

  return {
    findExistingConversation,
    createOrUpdateConversation,
    sendMessage
  };
};
