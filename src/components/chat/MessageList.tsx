
import React from "react";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/messages";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  className?: string;
}

export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] scrollbar-thin scrollbar-thumb-[#64B5D9]/20 scrollbar-track-transparent",
          className
        )}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "assistant" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2 text-[#F2EBE4]",
                message.role === "assistant" 
                  ? "bg-[#64B5D9]/20 rounded-bl-sm" 
                  : "bg-[#9B6CD9]/20 rounded-br-sm"
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#64B5D9]/20 rounded-2xl rounded-bl-sm px-4 py-2">
              <Loader className="w-4 h-4 animate-spin text-[#64B5D9]" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
