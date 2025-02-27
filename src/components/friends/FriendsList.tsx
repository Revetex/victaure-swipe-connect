
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Friend, UserProfile, transformConnection } from "@/types/profile";
import { FriendItem } from "../feed/friends/FriendItem";
import { EmptyConnectionsState } from "../feed/friends/EmptyConnectionsState";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface FriendsListProps {
  showOnlineOnly?: boolean;
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
}

export function FriendsList({
  showOnlineOnly = false,
  searchQuery = "",
  currentPage = 1,
  itemsPerPage = 5
}: FriendsListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    data: friends = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["friends", user?.id, showOnlineOnly, searchQuery, currentPage, itemsPerPage],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // Utiliser la vue user_connections_view créée par le script SQL
        const { data: connections, error } = await supabase
          .from('user_connections_view')
          .select('*')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) {
          console.error("Error loading friends:", error);
          return [];
        }

        if (!connections) return [];

        // Format connections as Friend objects using the transform utility
        const friendsList = connections.map(conn => 
          transformConnection(conn, user.id)
        );

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

  const friendProfiles = friends.map(friend => {
    const profile: UserProfile = {
      id: friend.id,
      full_name: friend.full_name,
      avatar_url: friend.avatar_url,
      email: friend.email,
      role: friend.role,
      bio: friend.bio,
      phone: friend.phone,
      city: friend.city,
      state: friend.state,
      country: friend.country,
      skills: friend.skills,
      online_status: friend.online_status,
      last_seen: friend.last_seen,
      created_at: friend.created_at,
    };
    return profile;
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
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/friends/search")}
          >
            <UserPlus className="h-4 w-4" />
            Ajouter des amis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friendProfiles.map(friend => (
        <FriendItem key={friend.id} friend={friend} onRemove={() => refetch()} />
      ))}
    </div>
  );
}
