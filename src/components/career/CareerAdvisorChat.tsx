import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat/messageTypes";

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
    <div className="flex flex-col h-[600px] max-h-[80vh]">
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
  );
}