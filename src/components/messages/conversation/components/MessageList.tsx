
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/messages";
import { ChatMessage } from "../../ChatMessage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RefObject } from "react";

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
  return (
    <ScrollArea className="flex-1 p-4 bg-[#1C1C1C]">
      <div className="space-y-4">
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
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3C3C3C]/20"
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
