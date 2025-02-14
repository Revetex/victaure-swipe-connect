
import { useState } from "react";
import { useReceiver } from "./useReceiver";
import { useMessageQuery } from "./messages/useMessageQuery";
import { useMessageSubscription } from "./messages/useMessageSubscription";
import { useSendMessage } from "./messages/useSendMessage";
import { useMarkAsRead } from "./messages/useMarkAsRead";
import { Message } from "@/types/messages";

const MESSAGES_PER_PAGE = 20;

export function useMessages() {
  const { receiver } = useReceiver();
  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Subscribe to real-time message updates
  useMessageSubscription();

  const { data: messages = [], isLoading } = useMessageQuery(receiver, lastCursor, hasMore);
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
