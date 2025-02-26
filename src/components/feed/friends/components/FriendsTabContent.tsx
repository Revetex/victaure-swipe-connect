
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
    <div className="relative h-[500px] rounded-xl border border-white/10 bg-gradient-to-br from-[#1B2A4A]/50 via-[#1B2A4A]/30 to-[#1B2A4A]/20 backdrop-blur-sm p-4">
      <ScrollArea className="h-full">
        <div className="space-y-3">
          {displayedFriends.length > 0 ? (
            displayedFriends.map(friend => (
              <div
                key={friend.id}
                className="group relative rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10"
              >
                <FriendCard friend={friend} />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#9b87f5]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))
          ) : (
            showOnlineOnly ? (
              <div className="flex h-full items-center justify-center text-center text-white/60">
                Aucune connexion en ligne
              </div>
            ) : (
              <EmptyConnectionsState />
            )
          )}
        </div>
      </ScrollArea>
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-[#1B2A4A]/20 to-transparent" />
    </div>
  );
}
