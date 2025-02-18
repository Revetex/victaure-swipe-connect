
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export const useConversationHandler = () => {
  const findExistingConversation = async (userId: string, partnerId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(
        `and(participant1_id.eq.${userId},participant2_id.eq.${partnerId}),` +
        `and(participant1_id.eq.${partnerId},participant2_id.eq.${userId})`
      )
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const createOrUpdateConversation = async (userId: string, partnerId: string, lastMessage?: string) => {
    const existingConversation = await findExistingConversation(userId, partnerId);

    if (!existingConversation) {
      const { error: conversationError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: userId,
          participant2_id: partnerId,
          ...(lastMessage ? {
            last_message: lastMessage,
            last_message_time: new Date().toISOString()
          } : {})
        });

      if (conversationError && conversationError.code !== '23505') {
        throw conversationError;
      }
    } else if (lastMessage) {
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
  };

  const sendMessage = async (content: string, senderId: string, receiverId: string) => {
    const messageData = {
      content,
      sender_id: senderId,
      receiver_id: receiverId,
      is_assistant: false,
      message_type: 'user' as const,
      status: 'sent' as const,
      metadata: {
        timestamp: new Date().toISOString(),
        type: 'chat'
      }
    };

    await createOrUpdateConversation(senderId, receiverId, content);

    const { error: messageError } = await supabase
      .from('messages')
      .insert(messageData);

    if (messageError) throw messageError;
  };

  return {
    findExistingConversation,
    createOrUpdateConversation,
    sendMessage
  };
};
