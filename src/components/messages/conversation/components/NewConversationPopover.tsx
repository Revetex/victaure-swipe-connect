
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FriendsList } from "./FriendsList";
import type { Receiver } from "@/types/messages";

interface NewConversationPopoverProps {
  onLoadFriends: () => void;
  friends: Receiver[];
  loadingFriends: boolean;
  onSelectFriend: (friend: Receiver) => void;
}

export function NewConversationPopover({
  onLoadFriends,
  friends,
  loadingFriends,
  onSelectFriend
}: NewConversationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0"
          onClick={onLoadFriends}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Nouvelle conversation</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-2">
          <h3 className="font-medium px-2 py-1">Démarrer une conversation</h3>
          <FriendsList
            friends={friends}
            loadingFriends={loadingFriends}
            onSelectFriend={onSelectFriend}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
