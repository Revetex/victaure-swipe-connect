import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Message } from "@/hooks/useChat";
import { useEffect, useRef } from "react";

interface ChatContainerProps {
  messages: Message[];
  isThinking: boolean;
}

export function ChatContainer({ messages, isThinking }: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollAreaRef}
      className="flex-grow overflow-y-auto mb-4 px-4 scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent"
    >
      <div className="space-y-4 py-4">
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
    </div>
  );
}