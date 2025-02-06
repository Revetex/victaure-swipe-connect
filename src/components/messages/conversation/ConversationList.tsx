import { Message, Receiver } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FriendSelector } from "./FriendSelector";

interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: Receiver) => void;
}

export function ConversationList({
  messages,
  chatMessages,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Messages</h2>
          <div className="flex gap-2">
            <FriendSelector onSelectFriend={(friendId) => onSelectConversation("user", { id: friendId } as Receiver)} />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AssistantMessage
            chatMessages={chatMessages}
            onSelectConversation={() => onSelectConversation("assistant")}
          />
          
          <div className="space-y-2">
            {messages
              .filter((message) => 
                message.sender.full_name?.toLowerCase().includes(searchQuery) ||
                message.content.toLowerCase().includes(searchQuery)
              )
              .map((message) => (
                <UserMessage
                  key={message.id}
                  message={message}
                  onSelect={() => onSelectConversation("user", message.sender)}
                />
              ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}