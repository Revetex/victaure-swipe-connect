
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <div ref={ref} className="space-y-4 px-4 py-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 rounded-lg p-4",
              message.isUser ? "bg-[#2C2C2C]" : "bg-[#1C1C1C]"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-[#3C3C3C] flex items-center justify-center text-white">
              {message.isUser ? "V" : "M"}
            </div>
            <div className="flex-1">
              <div className="text-[#E0E0E0]">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#64B5D9]" />
          </div>
        )}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
