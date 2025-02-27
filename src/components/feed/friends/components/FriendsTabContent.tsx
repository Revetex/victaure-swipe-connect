
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { FriendCard, FriendCardSkeleton } from "./FriendCard";
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
  
  const { data: friends = [], isLoading, refetch } = useQuery({
    queryKey: ["friends", user?.id, showOnlineOnly],
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
          online_status: Math.random() > 0.5, // Simulation pour l'exemple - à remplacer par une vraie valeur
          last_seen: new Date().toISOString(),
          certifications: [],
          education: [],
          experiences: [],
          friends: [],
          verified: Math.random() > 0.7 // Simulation pour l'exemple
        } as UserProfile;
      });
    }
  });

  const filteredFriends = showOnlineOnly ? friends.filter(f => f.online_status) : friends;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedFriends = filteredFriends.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <FriendCardSkeleton key={index} />
        ))}
      </div>
    );
  }

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
        <FriendCard 
          key={friend.id} 
          friend={friend} 
          onRemove={() => refetch()}
        />
      ))}
    </div>
  );
}
