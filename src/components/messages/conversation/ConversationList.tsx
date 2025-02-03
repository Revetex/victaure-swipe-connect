import { Message } from "@/types/messages";
import { AssistantMessage } from "./AssistantMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMessage } from "./UserMessage";
import { Separator } from "@/components/ui/separator";

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
  const hasMessages = messages?.length > 0;
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {/* AI Assistant Section */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-2 px-2">Assistant IA</h3>
          <div onClick={() => onSelectConversation("assistant")}>
            <AssistantMessage
              chatMessages={chatMessages}
              onSelectConversation={onSelectConversation}
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Users Section */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-2 px-2">Conversations</h3>
          <div className="space-y-2">
            {!hasMessages ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>Aucune conversation pour le moment</p>
                <p className="text-sm">Commencez une nouvelle conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <UserMessage
                  key={message.id}
                  message={message}
                  onClick={() => onSelectConversation("user", message.sender)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}