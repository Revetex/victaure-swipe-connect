
import { ConversationHeader } from "./ConversationHeader";
import { AssistantMessage } from "./AssistantMessage";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Message, Receiver } from "@/types/messages";
import { ScrollArea } from "@/components/ui/scroll-area";

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
              <Button variant="outline" size="icon" onClick={onRefresh} className="shrink-0">
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

      <ScrollArea className="flex-1">
        <div className="divide-y">
          <AssistantMessage 
            chatMessages={aiMessages} 
            onSelectConversation={() => onSelectConversation({
              id: 'assistant',
              full_name: 'M. Victaure',
              avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
              online_status: true,
              last_seen: new Date().toISOString()
            })} 
          />
          
          {conversations.map((conversation) => (
            <motion.button
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
              onClick={() => onSelectConversation(conversation.sender)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.sender.avatar_url || ''} />
                <AvatarFallback>
                  {conversation.sender.full_name[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium">{conversation.sender.full_name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.content}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
