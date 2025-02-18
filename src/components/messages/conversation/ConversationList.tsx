
import { Message } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
      <div className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {uniqueConversations.map((conversation) => {
            const date = new Date(conversation.created_at);
            const formattedDate = format(date, "PP", { locale: fr });
            const isToday = new Date().toDateString() === date.toDateString();
            const timeDisplay = isToday 
              ? format(date, "HH:mm")
              : formattedDate;

            return (
              <div
                key={conversation.id}
                className={cn(
                  "p-4 rounded-lg transition-colors cursor-pointer",
                  "hover:bg-muted/80",
                  "border border-border/50",
                  "animate-in fade-in-50"
                )}
                onClick={() => onSelectConversation(conversation.receiver)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {conversation.receiver?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                      {conversation.content}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {timeDisplay}
                  </time>
                </div>
              </div>
            );
          })}
          {uniqueConversations.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Aucune conversation.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
