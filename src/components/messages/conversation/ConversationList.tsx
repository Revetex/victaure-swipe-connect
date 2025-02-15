import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationListProps {
  conversations: Message[];
  onSelectConversation: (receiver: any) => void;
}

export function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-3 rounded-md bg-secondary hover:bg-secondary/80 cursor-pointer"
              onClick={() => onSelectConversation(conversation.receiver)}
            >
              <h3 className="font-medium">{conversation.receiver.full_name}</h3>
              <p className="text-sm text-muted-foreground">{conversation.content}</p>
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune conversation.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
