
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, Receiver } from "@/types/messages";
import { useMessagesStore } from "@/store/messagesStore";

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { addMessage } = useMessagesStore();

  const mutation = useMutation({
    mutationFn: async ({ content, receiver }: { content: string; receiver: Receiver }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const messageType = receiver.id === 'assistant' ? 'assistant' as const : 'user' as const;
      const now = new Date().toISOString();

      const messageData = {
        content,
        sender_id: user.id,
        receiver_id: receiver.id,
        message_type: messageType,
        read: false,
        status: 'sent' as const,
        created_at: now,
        updated_at: now,
        timestamp: now,
        metadata: {} as Record<string, any>,
        receiver: receiver,
        reaction: null,
        is_assistant: receiver.id === 'assistant'
      };

      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert(messageData)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (messageError) throw messageError;
      return message;
    },
    onSuccess: (messageData) => {
      if (messageData) {
        const formattedMessage: Message = {
          ...messageData,
          timestamp: messageData.created_at,
          status: 'sent',
          message_type: messageData.is_assistant ? 'assistant' : 'user',
          metadata: messageData.metadata || {},
          reaction: messageData.reaction || null
        };
        addMessage(formattedMessage);
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  return mutation;
}
