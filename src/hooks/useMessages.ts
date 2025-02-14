
import { useState } from "react";
import { useReceiver } from "./useReceiver";
import { useMessageQuery } from "./useMessageQuery";
import { useMessageSubscription } from "./useMessageSubscription";
import { useSendMessage } from "./messages/useSendMessage";
import { useMarkAsRead } from "./messages/useMarkAsRead";
import { Message } from "@/types/messages";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const MESSAGES_PER_PAGE = 20;

export function useMessages() {
  const { receiver } = useReceiver();
  const [lastCursor, setLastCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const { 
    data: messages = [], 
    isLoading,
    error,
    refetch
  } = useMessageQuery(receiver, lastCursor, hasMore, {
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Gérer les erreurs de requête
  if (error) {
    console.error("Erreur de chargement:", error);
    toast.error("Erreur lors du chargement des messages. Réessayez plus tard.");
  }

  useMessageSubscription({
    onMessage: (newMessage: Message) => {
      if (!receiver) return;
      
      queryClient.setQueryData(['messages', receiver.id, lastCursor], (oldMessages: Message[] = []) => {
        const uniqueMessages = [...new Set([newMessage, ...oldMessages])];
        return uniqueMessages.filter((msg, index, self) => 
          self.findIndex(m => m.id === msg.id) === index
        );
      });
    }
  });

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead(receiver?.id);

  const handleSendMessage = async (content: string) => {
    if (!receiver || !content.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({ content, receiver });
      await refetch(); // Recharger les messages après l'envoi
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const updatePagination = (currentMessages: Message[]) => {
    if (!Array.isArray(currentMessages) || currentMessages.length === 0) {
      setHasMore(false);
      return;
    }

    setHasMore(currentMessages.length >= MESSAGES_PER_PAGE);
    setLastCursor(currentMessages[currentMessages.length - 1].created_at);
  };

  return {
    messages: Array.isArray(messages) ? messages : [],
    isLoading,
    error,
    markAsRead: markAsReadMutation,
    handleSendMessage,
    hasMore,
    lastCursor,
    updatePagination
  };
}
