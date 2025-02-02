import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHeader } from "../conversation/SearchHeader";
import { UserMessage } from "../conversation/UserMessage";
import { useState } from "react";
import { Message } from "@/types/chat/messageTypes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssistantMessage } from "./AssistantMessage";

interface MessagesListProps {
  messages: any[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
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
        <div className="p-4 space-y-4">
          {/* Only show Mr. Victaure's conversation */}
          <div onClick={() => onSelectConversation("assistant")}>
            <AssistantMessage
              chatMessages={chatMessages}
              onSelectConversation={onSelectConversation}
            />
          </div>

          {/* Show empty state when no messages */}
          {messages?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>Aucune conversation pour le moment</p>
              <p className="text-sm">Commencez une nouvelle conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}