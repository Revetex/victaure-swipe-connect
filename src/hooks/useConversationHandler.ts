
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useConversationHandler = () => {
  const findExistingConversation = async (userId: string, partnerId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${partnerId}),and(participant1_id.eq.${partnerId},participant2_id.eq.${userId})`)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const createOrUpdateConversation = async (userId: string, partnerId: string, lastMessage?: string) => {
    try {
      const existingConversation = await findExistingConversation(userId, partnerId);

      if (existingConversation) {
        if (lastMessage) {
          const { error: updateError } = await supabase
            .from('conversations')
            .update({
              last_message: lastMessage,
              last_message_time: new Date().toISOString()
            })
            .eq('id', existingConversation.id);

          if (updateError) throw updateError;
        }
        return existingConversation;
      }

      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: userId,
          participant2_id: partnerId,
          ...(lastMessage ? {
            last_message: lastMessage,
            last_message_time: new Date().toISOString()
          } : {})
        })
        .select()
        .single();

      if (createError) throw createError;
      return newConversation;
    } catch (error: any) {
      // If it's a duplicate key error, try to fetch the existing conversation again
      if (error.code === '23505') {
        const existingConversation = await findExistingConversation(userId, partnerId);
        if (existingConversation) {
          return existingConversation;
        }
      }
      throw error;
    }
  };

  const sendMessage = async (content: string, senderId: string, receiverId: string) => {
    try {
      const conversation = await createOrUpdateConversation(senderId, receiverId, content);

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
