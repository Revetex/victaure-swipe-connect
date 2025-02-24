
import { forwardRef } from "react";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-[400px] overflow-y-auto py-4 px-3 scrollbar-none space-y-2.5"
      >
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
              message.isUser
                ? 'bg-[#64B5D9] text-white'
                : 'bg-[#2A2D3E] text-[#F1F0FB]'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
