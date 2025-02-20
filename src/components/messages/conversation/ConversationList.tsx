
import { ConversationHeader } from "./ConversationHeader";
import { AssistantMessage } from "./AssistantMessage";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Message, Receiver } from "@/types/messages";

interface ConversationListProps {
  conversations: Message[];
  aiMessages: Message[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onSelectConversation: (receiver: Receiver) => void;
  onStartNewChat: (friendId: string) => void;
}

export function ConversationList({
  conversations,
  aiMessages,
  searchQuery,
  onSearchChange,
  onRefresh,
  onSelectConversation,
  onStartNewChat
}: ConversationListProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRefresh}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <FriendSelector onSelectFriend={onStartNewChat}>
                <Button variant="default" size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </FriendSelector>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <AssistantMessage 
            chatMessages={aiMessages}
            onSelectConversation={() => {
              onSelectConversation({
                id: 'assistant',
                full_name: 'M. Victaure',
                avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                online_status: true,
                last_seen: new Date().toISOString()
              });
            }}
          />
          
          <div className="pt-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectConversation(conversation.receiver)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {conversation.receiver?.avatar_url ? (
                      <img
                        src={conversation.receiver.avatar_url}
                        alt={conversation.receiver.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-primary">
                        {conversation.receiver?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {conversation.receiver?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
