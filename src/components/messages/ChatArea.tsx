import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { RefObject } from "react";
import type { Message } from "@/hooks/useChat";

interface ChatAreaProps {
  messages: Message[];
  scrollAreaRef: RefObject<HTMLDivElement>;
}

export function ChatArea({ messages, scrollAreaRef }: ChatAreaProps) {
  return (
    <ScrollArea 
      ref={scrollAreaRef} 
      className="flex-1 p-4"
    >
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            sender={message.sender}
            thinking={message.thinking}
            showTimestamp={
              index === 0 || 
              messages[index - 1]?.sender !== message.sender ||
              new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp).getTime() > 300000
            }
            timestamp={message.timestamp}
          />
        ))}
      </div>
    </ScrollArea>
  );
}