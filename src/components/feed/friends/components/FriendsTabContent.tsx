
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

      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          friend:profiles!friendships_friend_id_fkey(
            id, 
            full_name,
            avatar_url,
            email,
            role,
            bio,
            phone,
            city,
            state, 
            country,
            skills,
            online_status,
            last_seen
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) {
        console.error("Error fetching friends:", error);
        return [];
      }

      return (friendships || []).map(friendship => {
        const friend = friendship.friend as any;
        return {
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          email: friend.email,
          role: friend.role || 'professional',
          bio: friend.bio,
          phone: friend.phone,
          city: friend.city,
          state: friend.state,
          country: friend.country || 'Canada',
          skills: friend.skills || [],
          online_status: friend.online_status || false,
          last_seen: friend.last_seen || new Date().toISOString(),
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
    <ScrollArea className="h-[600px]">
      <div className="space-y-3 p-1 rounded">
        {displayedFriends.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </ScrollArea>
  );
}
