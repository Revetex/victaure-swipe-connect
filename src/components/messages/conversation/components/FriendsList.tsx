
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Receiver } from "@/types/messages";

interface FriendsListProps {
  friends: Receiver[];
  loadingFriends: boolean;
  onSelectFriend: (friend: Receiver) => void;
}

export function FriendsList({ friends, loadingFriends, onSelectFriend }: FriendsListProps) {
  if (loadingFriends) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Aucun ami trouvé
      </div>
    );
  }

  return (
    <ScrollArea className="h-72">
      {friends.map((friend) => (
        <Button
          key={friend.id}
          variant="ghost"
          className="w-full justify-start gap-2 p-2"
          onClick={() => onSelectFriend(friend)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={friend.avatar_url || undefined} />
            <AvatarFallback>
              {friend.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{friend.full_name}</span>
        </Button>
      ))}
    </ScrollArea>
  );
}
