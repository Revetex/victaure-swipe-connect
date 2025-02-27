
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { FriendItem } from "./FriendItem";
import { EmptyConnectionsState } from "./EmptyConnectionsState";

interface FriendListProps {
  showOnlineOnly?: boolean;
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
}

export function FriendList({
  showOnlineOnly = false,
  searchQuery = "",
  currentPage = 1,
  itemsPerPage = 5
}: FriendListProps) {
  const { user } = useAuth();
  
  const {
    data: friends = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["friends", user?.id, showOnlineOnly, searchQuery, currentPage, itemsPerPage],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // Get connections from user_connections table
        const { data: connections, error } = await supabase
          .from('user_connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            sender:profiles!sender_id(id, full_name, avatar_url, online_status, last_seen),
            receiver:profiles!receiver_id(id, full_name, avatar_url, online_status, last_seen)
          `)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) {
          console.error("Error loading friends:", error);
          return [];
        }

        if (!connections) return [];

        // Format connections as UserProfiles
        const friendsList = connections.map(conn => {
          const isSender = conn.sender_id === user.id;
          const friendData = isSender ? conn.receiver : conn.sender;
          
          if (!friendData) return null;

          // Create a UserProfile with required fields
          const profile: UserProfile = {
            id: friendData.id,
            full_name: friendData.full_name || '',
            avatar_url: friendData.avatar_url || null,
            email: '',
            role: 'professional',
            bio: '',
            phone: '',
            city: '',
            state: '',
            country: '',
            skills: [],
            online_status: friendData.online_status,
            last_seen: friendData.last_seen,
            created_at: new Date().toISOString(),
          };
          
          return profile;
        }).filter(Boolean) as UserProfile[];

        // Apply filters
        let filteredFriends = friendsList || [];
        
        if (showOnlineOnly) {
          filteredFriends = filteredFriends.filter(friend => friend.online_status);
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredFriends = filteredFriends.filter(friend => 
            (friend.full_name || '').toLowerCase().includes(query)
          );
        }
        
        // Apply pagination
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedFriends = filteredFriends.slice(start, end);
        
        return paginatedFriends;
      } catch (error) {
        console.error("Error in fetchFriends:", error);
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!friends.length) {
    return (
      <div className="h-full">
        {searchQuery ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucun résultat pour "{searchQuery}"
          </div>
        ) : showOnlineOnly ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucune connexion en ligne actuellement
          </div>
        ) : (
          <EmptyConnectionsState />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map(friend => (
        <FriendItem key={friend.id} friend={friend} onRemove={() => refetch()} />
      ))}
    </div>
  );
}
