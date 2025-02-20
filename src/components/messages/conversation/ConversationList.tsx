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
  return <div className="absolute inset-0 flex flex-col">
      <div className="flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <div className="flex gap-2">
              
              <FriendSelector onSelectFriend={onStartNewChat}>
                <Button variant="default" size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </FriendSelector>
            </div>
          </div>
        </div>
      </div>

      
    </div>;
}