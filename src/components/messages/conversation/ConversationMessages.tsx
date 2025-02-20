
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationMessagesProps {
  messages: Message[];
  onScroll?: (event: any) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export function ConversationMessages({ 
  messages, 
  onScroll,
  scrollRef 
}: ConversationMessagesProps) {
  return (
    <ScrollArea 
      className="flex-1 pt-4 flex flex-col-reverse"
      onScrollCapture={onScroll}
    >
      <div className="space-y-4 px-4 max-w-3xl mx-auto">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
