import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { MessageItem } from "./MessageItem";
import type { Message } from "@/hooks/useMessages";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onMarkAsRead: (messageId: string) => void;
}

export function MessageList({ messages, isLoading, onMarkAsRead }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <MessageSquare className="h-8 w-8 mb-2" />
        <p>Aucun message</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
      <AnimatePresence>
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              {...message}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}