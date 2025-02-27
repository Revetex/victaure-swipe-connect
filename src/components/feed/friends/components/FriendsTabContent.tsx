
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendCard } from "./FriendCard";
import { EmptyConnectionsState } from "../EmptyConnectionsState";

interface FriendsTabContentProps {
  currentPage: number;
  itemsPerPage: number;
  showOnlineOnly?: boolean;
}

export function FriendsTabContent({
  currentPage,
  itemsPerPage,
  showOnlineOnly = false
}: FriendsTabContentProps) {
  const { user } = useAuth();
  
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase.rpc('get_user_connections', {
        user_id: user.id
      });

      if (error) {
        console.error("Error fetching friends:", error);
        return [];
      }

      // Filter only accepted friend connections
      const acceptedFriends = data.filter(conn => 
        conn.status === 'accepted' && conn.connection_type === 'friend'
      );

      // Map to UserProfile format
      return acceptedFriends.map(friend => {
        return {
          id: friend.other_user_id,
          full_name: friend.other_user_name,
          avatar_url: friend.other_user_avatar,
          email: null,
          role: 'professional',
          bio: null,
          phone: null,
          city: null,
          state: null,
          country: 'Canada',
          skills: [],
          online_status: false, // We'll need to update this in a future enhancement
          last_seen: new Date().toISOString(),
          certifications: [],
          education: [],
          experiences: [],
          friends: [],
          verified: false
        } as UserProfile;
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64B5D9]" />
      </div>
    );
  }

  const filteredFriends = showOnlineOnly ? friends.filter(f => f.online_status) : friends;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedFriends = filteredFriends.slice(startIndex, endIndex);

  if (!displayedFriends.length) {
    return showOnlineOnly ? (
      <div className="text-center text-white/60 py-8">
        Aucune connexion en ligne
      </div>
    ) : (
      <EmptyConnectionsState />
    );
  }

  return (
    <div className="space-y-3">
      {displayedFriends.map(friend => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
