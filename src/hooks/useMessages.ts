
import { useState } from "react";
import { useReceiver } from "./useReceiver";
import { useMessageQuery } from "./useMessageQuery";
import { useMessageSubscription } from "./useMessageSubscription";
import { useSendMessage } from "./messages/useSendMessage";
import { useMarkAsRead } from "./messages/useMarkAsRead";
import { Message } from "@/types/messages";
import { useQueryClient } from "@tanstack/react-query";

const MESSAGES_PER_PAGE = 20;

export function useMessages() {
  const { receiver } = useReceiver();
  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  // Configure staleTime to cache messages for 1 minute
  const { data: messages = [], isLoading } = useMessageQuery(receiver, lastCursor, hasMore, {
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  // Subscribe to real-time message updates
  useMessageSubscription({
    onMessage: (newMessage) => {
      queryClient.setQueryData(['messages', receiver?.id, lastCursor], (oldMessages: Message[] = []) => {
        const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
        if (messageExists) return oldMessages;
        return [...oldMessages, newMessage];
      });
    }
  });

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead(receiver?.id);

  const handleSendMessage = async (content: string) => {
    if (!receiver) return;
    await sendMessageMutation.mutateAsync({ content, receiver });
  };

  const updatePagination = (messages: Message[]) => {
    setHasMore(messages.length === MESSAGES_PER_PAGE);
    if (messages.length > 0) {
      setLastCursor(messages[messages.length - 1].created_at);
    }
  };

  return {
    messages,
    isLoading,
    markAsRead: markAsReadMutation,
    handleSendMessage,
    hasMore,
    lastCursor,
    updatePagination
  };
}
