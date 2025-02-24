
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
        className="h-[400px] overflow-y-auto py-4 px-3 scrollbar-none space-y-2.5 flex flex-col"
      >
        <div className="flex-1">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex mb-3 items-end ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="w-6 h-6 rounded-full bg-[#64B5D9] flex items-center justify-center mr-2 mb-1">
                  <span className="text-xs text-white font-medium">MV</span>
                </div>
              )}
              
              <div className={`relative max-w-[85%] rounded-2xl px-3.5 py-2 ${
                message.isUser 
                  ? 'bg-[#64B5D9] text-white rounded-br-sm' 
                  : 'bg-[#2A2D3E] text-[#F1F0FB] rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={`absolute -bottom-4 text-[10px] ${
                  message.isUser ? 'right-0 text-[#64B5D9]' : 'left-0 text-[#F1F0FB]/60'
                }`}>
                  {message.isUser ? 'Vous' : 'Mr. Victaure'}
                </span>
              </div>

              {message.isUser && (
                <div className="w-6 h-6 rounded-full bg-[#2A2D3E] flex items-center justify-center ml-2 mb-1">
                  <span className="text-xs text-white font-medium">V</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
