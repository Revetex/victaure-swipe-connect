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
export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({
  messages,
  isLoading
}, ref) => {
  return <div ref={ref} className="space-y-4 px-4 py-6">
        {messages.map((message, index) => {})}
        
        {isLoading && <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#64B5D9]" />
          </div>}
      </div>;
});
MessageList.displayName = "MessageList";