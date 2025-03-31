
import { useEffect } from "react";
import { Message } from "@/types/messages";
import { useChatMessages } from "@/hooks/useChatMessages";
import { MessageItem } from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationViewProps {
  conversationId: string;
  viewerId: string;
}

export function ConversationView({ conversationId, viewerId }: ConversationViewProps) {
  const { messages, isLoading, error, refresh } = useChatMessages(conversationId);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      const element = document.getElementById("messages-end");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Retry on error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        refresh();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, refresh]);

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-13rem)] relative px-4">
      {isLoading && messages.length === 0 ? (
        <div className="flex justify-center pt-10">
          <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          {messages.map((message: Message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isOutgoing={message.sender_id === viewerId} 
            />
          ))}
          <div id="messages-end" className="h-px" />
        </div>
      )}
    </ScrollArea>
  );
}
