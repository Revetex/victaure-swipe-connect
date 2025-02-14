
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

  // S'assurer que messages a une valeur par défaut
  const { data: messages = [], isLoading } = useMessageQuery(receiver, lastCursor, hasMore, {
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // S'assurer que nous avons un tableau même si onMessage reçoit undefined
  useMessageSubscription({
    onMessage: (newMessage: Message) => {
      queryClient.setQueryData(['messages', receiver?.id, lastCursor], (oldMessages: Message[] = []) => {
        if (!oldMessages) return [newMessage];
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

  const updatePagination = (currentMessages: Message[]) => {
    if (!currentMessages) {
      setHasMore(false);
      return;
    }
    setHasMore(currentMessages.length === MESSAGES_PER_PAGE);
    if (currentMessages.length > 0) {
      setLastCursor(currentMessages[currentMessages.length - 1].created_at);
    }
  };

  return {
    messages: messages || [], // Garantir un tableau même si messages est undefined
    isLoading,
    markAsRead: markAsReadMutation,
    handleSendMessage,
    hasMore,
    lastCursor,
    updatePagination
  };
}
