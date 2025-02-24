
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
        className="h-[400px] overflow-y-auto p-4 scrollbar-none space-y-4"
        style={{
          backgroundImage: "url('/lovable-uploads/60542c40-c17c-42cc-8136-f4780f09946a.png')",
          backgroundSize: "32px",
          backgroundRepeat: "repeat"
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.isUser
                ? 'bg-[#64B5D9] text-white'
                : 'bg-[#2A2D3E] text-[#F1F0FB]'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
