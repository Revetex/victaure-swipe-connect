
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationListProps {
  conversations: Message[];
  onSelectConversation: (receiver: any) => void;
}

export function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  // Regrouper les conversations par receiver_id pour éviter les doublons
  const uniqueConversations = conversations.reduce((acc: Message[], curr) => {
    const existingConv = acc.find(
      conv => conv.receiver_id === curr.receiver_id
    );
    if (!existingConv) {
      acc.push(curr);
    } else if (new Date(curr.created_at) > new Date(existingConv.created_at)) {
      // Garder la conversation la plus récente
      const index = acc.indexOf(existingConv);
      acc[index] = curr;
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {uniqueConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-3 rounded-md bg-secondary hover:bg-secondary/80 cursor-pointer"
              onClick={() => onSelectConversation(conversation.receiver)}
            >
              <h3 className="font-medium truncate">{conversation.receiver?.full_name}</h3>
              <p className="text-sm text-muted-foreground whitespace-normal break-words line-clamp-2">
                {conversation.content}
              </p>
            </div>
          ))}
          {uniqueConversations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune conversation.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
