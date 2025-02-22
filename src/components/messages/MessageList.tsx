
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/messages";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RefObject, useEffect } from "react";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onDeleteMessage: (messageId: string) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  onDeleteMessage,
  messagesEndRef 
}: MessageListProps) {
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 flex flex-col-reverse">
        {messages.map((message) => (
          <div key={message.id} className="relative group">
            <ChatMessage 
              message={message}
              isOwn={message.sender_id === currentUserId}
            />
            {message.sender_id === currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteMessage(message.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
