import { ChatMessages } from "./ChatMessages";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat/messageTypes";
import { motion } from "framer-motion";

interface CareerAdvisorChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function CareerAdvisorChat({
  messages,
  isLoading,
  onSendMessage,
}: CareerAdvisorChatProps) {
  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-card rounded-lg shadow-md overflow-hidden">
        <ChatHeader isLoading={isLoading} />
        
        <ScrollArea className="flex-1 p-4">
          <ChatMessages 
            messages={messages} 
            isTyping={isLoading} 
          />
        </ScrollArea>

        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <QuickSuggestions onSelect={onSendMessage} />
          <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
}