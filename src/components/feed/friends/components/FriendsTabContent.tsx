
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Friend, UserRole } from "@/types/profile";
import { FriendCard, FriendCardSkeleton } from "./FriendCard";
import { EmptyConnectionsState } from "../EmptyConnectionsState";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useEffect } from "react";

interface FriendsTabContentProps {
  currentPage: number;
  itemsPerPage: number;
  showOnlineOnly?: boolean;
  searchQuery?: string;
}

export function FriendsTabContent({
  currentPage,
  itemsPerPage,
  showOnlineOnly = false,
  searchQuery = ""
}: FriendsTabContentProps) {
  const { user } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [displayPage, setDisplayPage] = useState(currentPage);
  
  const {
    data: friends = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["friends", user?.id, showOnlineOnly, searchQuery, displayPage],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // Au lieu d'utiliser la relation qui cause l'erreur, faisons deux requêtes séparées
        // D'abord, récupérons les connexions de l'utilisateur
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections_view')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend');

        if (connectionsError) {
          console.error("Error fetching connections:", connectionsError);
          return [];
        }

        if (!connections || connections.length === 0) return [];

        // Map connections to Friend objects
        const friendsList: Friend[] = connections.map(conn => {
          const isUserSender = conn.sender_id === user.id;
          
          // Déterminer le rôle valide à partir des données du profil (default to professional)
          let role: UserRole = 'professional';
          
          // Créer un profil d'ami en combinant les données
          const friend: Friend = {
            id: isUserSender ? conn.receiver_id : conn.sender_id,
            full_name: isUserSender ? conn.receiver_name : conn.sender_name,
            avatar_url: isUserSender ? conn.receiver_avatar : conn.sender_avatar,
            email: null,
            role: role,
            bio: '',
            phone: '',
            city: '',
            state: '',
            country: 'Canada',
            skills: [],
            online_status: false, // Will be updated below
            last_seen: null,
            created_at: conn.created_at || new Date().toISOString(),
            friendship_id: conn.id,
            status: conn.status,
            friends: [] // Propriété obligatoire
          };
          
          return friend;
        });

        // Get online status for these friends if any exist
        if (friendsList.length > 0) {
          const friendIds = friendsList.map(f => f.id);
          
          const { data: onlineData } = await supabase
            .from('profiles')
            .select('id, online_status, last_seen')
            .in('id', friendIds);
            
          if (onlineData) {
            // Update the online status of each friend
            friendsList.forEach(friend => {
              const profile = onlineData.find(p => p.id === friend.id);
              if (profile) {
                friend.online_status = profile.online_status;
                friend.last_seen = profile.last_seen;
              }
            });
          }
        }

        // Filter by online status if requested
        let filteredFriends = [...friendsList];
        if (showOnlineOnly) {
          filteredFriends = filteredFriends.filter(friend => friend.online_status);
        }

        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredFriends = filteredFriends.filter(friend => 
            (friend.full_name || '').toLowerCase().includes(query)
          );
        }

        // Calculate total pages
        setTotalPages(Math.ceil(filteredFriends.length / itemsPerPage));

        // Apply pagination
        const startIndex = (displayPage - 1) * itemsPerPage;
        return filteredFriends.slice(startIndex, startIndex + itemsPerPage);
      } catch (error) {
        console.error("Error in fetchFriends:", error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  // Reset to page 1 when search query changes
  useEffect(() => {
    setDisplayPage(1);
  }, [searchQuery, showOnlineOnly]);

  const handlePageChange = (page: number) => {
    setDisplayPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <FriendCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!friends.length) {
    return showOnlineOnly ? (
      <div className="text-center text-white/60 py-8 bg-zinc-900/30 rounded-lg">
        Aucune connexion en ligne
      </div>
    ) : searchQuery ? (
      <div className="text-center text-white/60 py-8 bg-zinc-900/30 rounded-lg">
        Aucune connexion trouvée pour "{searchQuery}"
      </div>
    ) : (
      <EmptyConnectionsState />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {friends.map(friend => (
          <FriendCard 
            key={friend.id} 
            friend={friend as UserProfile} 
            onRemove={() => refetch()}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, displayPage - 1))}
                className={displayPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === displayPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, displayPage + 1))}
                className={displayPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
