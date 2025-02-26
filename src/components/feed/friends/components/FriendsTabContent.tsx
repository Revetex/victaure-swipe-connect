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
    return showOnlineOnly ? <div className="text-center text-muted-foreground py-8">
        Aucune connexion en ligne
      </div> : <EmptyConnectionsState />;
  }
  return <ScrollArea className="h-[600px]">
      <div className="space-y-3 p-1 bg-transparent rounded">
        {displayedFriends.map(friend => <FriendCard key={friend.id} friend={friend} />)}
      </div>
    </ScrollArea>;
}