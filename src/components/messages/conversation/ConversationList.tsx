
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ConversationSearch } from "./components/ConversationSearch";
import { ConversationItem } from "./components/ConversationItem";
import { useConversations } from "./hooks/useConversations";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();
  const navigate = useNavigate();
  const { conversations, handleDeleteConversation } = useConversations();

  const handleSelectConversation = (conversation: any) => {
    const receiver = {
      ...conversation.participant,
      online_status: conversation.participant.online_status ? 'online' : 'offline'
    };
    
    setReceiver(receiver);
    setShowConversation(true);
  };

  const handleAddConversation = () => {
    navigate('/feed/friends');
  };

  return (
    <div className={cn("flex flex-col border-r pt-20", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <ConversationSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={handleAddConversation}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              participant={conversation.participant}
              lastMessage={conversation.last_message}
              lastMessageTime={conversation.last_message_time}
              onSelect={() => handleSelectConversation(conversation)}
              onDelete={(e) => {
                e.stopPropagation();
                handleDeleteConversation(conversation.id, conversation.participant2_id);
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
