
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

  if (!displayedFriends.length) {
    return showOnlineOnly ? (
      <div className="flex h-[500px] items-center justify-center text-muted-foreground">
        Aucune connexion en ligne
      </div>
    ) : (
      <EmptyConnectionsState />
    );
  }

  return (
    <ScrollArea className="h-[500px] rounded-xl bg-card/5 p-4">
      <div className="space-y-2">
        {displayedFriends.map(friend => (
          <div
            key={friend.id}
            className="group relative overflow-hidden rounded-lg border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
          >
            <FriendCard friend={friend} />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
