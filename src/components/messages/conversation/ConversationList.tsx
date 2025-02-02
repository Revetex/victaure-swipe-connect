import { Message } from "@/types/messages";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
}

export function ConversationList({
  messages,
  chatMessages,
  onSelectConversation
}: ConversationListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        <div onClick={() => onSelectConversation("assistant")}>
          <AssistantMessage
            chatMessages={chatMessages}
            onSelectConversation={onSelectConversation}
          />
        </div>
        
        {messages.map((message) => (
          <div 
            key={message.id}
            onClick={() => onSelectConversation("user", message.sender)}
            className="cursor-pointer"
          >
            <UserMessage message={message} />
          </div>
        ))}

        {messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Aucune conversation pour le moment</p>
            <p className="text-sm">Commencez une nouvelle conversation!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}