
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

      const messageType = receiver.id === 'assistant' ? 'ai' as const : 'user' as const;
      const now = new Date().toISOString();

      const newMessage: Omit<Message, 'id' | 'sender'> = {
        content,
        sender_id: user.id,
        receiver_id: receiver.id,
        message_type: messageType,
        read: false,
        status: 'sent',
        created_at: now,
        updated_at: now,
        timestamp: now,
        metadata: {}
      };

      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert(newMessage)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (messageError) throw messageError;

      if (messageData) {
        const formattedMessage: Message = {
          ...messageData,
          timestamp: messageData.created_at,
          status: 'sent',
          message_type: messageType,
          metadata: (messageData.metadata || {}) as Record<string, any>,
          sender: messageData.sender || {
            id: user.id,
            full_name: user.user_metadata.full_name,
            avatar_url: '',
            online_status: true,
            last_seen: new Date().toISOString()
          },
          receiver: messageData.receiver || receiver
        };
        addMessage(formattedMessage);
      }

      await supabase.from('notifications').insert({
        user_id: receiver.id,
        title: 'Nouveau message',
        message: `${user.user_metadata.full_name || 'Quelqu\'un'} vous a envoyé un message`,
        type: 'message'
      });

      return messageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  return mutation;
}
