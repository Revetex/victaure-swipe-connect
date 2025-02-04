import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHeader } from "../conversation/SearchHeader";
import { UserMessage } from "../conversation/UserMessage";
import { Message } from "@/types/chat/messageTypes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssistantMessage } from "./AssistantMessage";
import { Separator } from "@/components/ui/separator";

interface ConversationListProps {
  messages: any[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
}

export function ConversationList({
  messages,
  chatMessages,
  onSelectConversation,
}: ConversationListProps) {
  const navigate = useNavigate();

  const handleNewConversation = () => {
    onSelectConversation("assistant");
  };

  return (
    <div className="h-full flex flex-col">
      <SearchHeader 
        onNewConversation={handleNewConversation}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Assistant Section - Pinned at top */}
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

          {/* User Conversations Section */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2 px-2">Conversations</h3>
            <div className="space-y-2">
              {messages.map((message) => (
                <UserMessage
                  key={message.id}
                  message={message}
                  onSelect={() => onSelectConversation("user", message.sender)}
                />
              ))}
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune conversation pour le moment
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}