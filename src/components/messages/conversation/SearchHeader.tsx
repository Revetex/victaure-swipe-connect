import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { FriendSelector } from "@/components/messages/conversation/FriendSelector";

interface SearchHeaderProps {
  unreadCount?: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchHeader({
  onSearch,
  onNewConversation,
  onSelectFriend
}: SearchHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <FriendSelector onSelectFriend={onSelectFriend} />
        <Button
          variant="outline"
          size="icon"
          onClick={onNewConversation}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}