
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendCard } from "./FriendCard";
import { EmptyConnectionsState } from "../EmptyConnectionsState";

interface FriendsTabContentProps {
  friends: UserProfile[];
  currentPage: number;
  itemsPerPage: number;
  showOnlineOnly?: boolean;
}

export function FriendsTabContent({
  friends,
  currentPage,
  itemsPerPage,
  showOnlineOnly = false
}: FriendsTabContentProps) {
  const filteredFriends = showOnlineOnly ? friends.filter(f => f.online_status) : friends;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedFriends = filteredFriends.slice(startIndex, endIndex);

  return (
    <ScrollArea className="h-[500px] rounded-lg bg-card/20 p-4">
      {displayedFriends.length > 0 ? (
        <div className="space-y-2">
          {displayedFriends.map(friend => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        showOnlineOnly ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune connexion en ligne
          </div>
        ) : (
          <EmptyConnectionsState />
        )
      )}
    </ScrollArea>
  );
}
