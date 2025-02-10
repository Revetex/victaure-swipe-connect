
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message, Receiver } from "@/types/messages";
import { useReceiver } from "./useReceiver";
import { useEffect, useState } from "react";
import { useMessagesStore } from "@/store/messagesStore";

const MESSAGES_PER_PAGE = 20;

export function useMessages() {
  const queryClient = useQueryClient();
  const { receiver } = useReceiver();
  const { addMessage, updateMessage, deleteMessage } = useMessagesStore();
  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Subscribe to real-time message updates
  useEffect(() => {
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            addMessage(newMessage);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            updateMessage(updatedMessage);
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            deleteMessage(deletedMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addMessage, updateMessage, deleteMessage]);

  const { data: messages = [], isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useQuery({
    queryKey: ["messages", receiver?.id, lastCursor],
    queryFn: async ({ pageParam = null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen
          )
        `)
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PER_PAGE);

      if (pageParam) {
        query = query.lt('page_cursor', pageParam);
      }

      if (receiver?.id === 'assistant') {
        query = query
          .eq('receiver_id', user.id)
          .eq('message_type', 'ai');
      } else if (receiver) {
        query = query.or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),` +
          `and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`
        ).eq('message_type', 'user');
      }

      const { data: messages, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
        throw error;
      }

      const formattedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.created_at,
        status: msg.read ? 'read' : 'delivered',
        message_type: (msg.message_type || 'user') as Message['message_type'],
        metadata: (msg.metadata || {}) as Record<string, any>
      })) as Message[];

      // Update pagination state
      setHasMore(formattedMessages.length === MESSAGES_PER_PAGE);
      if (formattedMessages.length > 0) {
        setLastCursor(formattedMessages[formattedMessages.length - 1].created_at);
      }

      return formattedMessages;
    },
    enabled: true,
    getNextPageParam: () => hasMore ? lastCursor : undefined
  });

  const handleSendMessage = async (content: string, receiver: Receiver) => {
    try {
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

      queryClient.invalidateQueries({ queryKey: ["messages", receiver.id] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) {
        console.error("Error marking message as read:", error);
        toast.error("Erreur lors du marquage du message comme lu");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiver?.id] });
    }
  });

  return {
    messages,
    isLoading,
    markAsRead,
    handleSendMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
}
