
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
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
        const { data: connections, error } = await supabase.rpc('get_user_connections', {
          user_id: user.id
        });

        if (error) {
          console.error("Error fetching friends:", error);
          return [];
        }

        // Filter only accepted friend connections
        let acceptedFriends = connections.filter(conn => 
          conn.status === 'accepted' && conn.connection_type === 'friend'
        );

        // Filter by online status if needed
        if (showOnlineOnly) {
          acceptedFriends = acceptedFriends.filter(friend => 
            // Adapter aux différentes structures possibles
            (typeof friend.other_user_online_status !== 'undefined' 
              ? friend.other_user_online_status 
              : false)
          );
        }

        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          acceptedFriends = acceptedFriends.filter(friend => 
            (friend.other_user_name || '').toLowerCase().includes(query)
          );
        }

        // Calculate total pages
        setTotalPages(Math.ceil(acceptedFriends.length / itemsPerPage));

        // Apply pagination
        const startIndex = (displayPage - 1) * itemsPerPage;
        const paginatedFriends = acceptedFriends.slice(startIndex, startIndex + itemsPerPage);

        // Map to UserProfile format
        return paginatedFriends.map(friend => {
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
            online_status: (typeof friend.other_user_online_status !== 'undefined') 
              ? friend.other_user_online_status 
              : false,
            last_seen: friend.other_user_last_seen || new Date().toISOString(),
            certifications: [],
            education: [],
            experiences: [],
            friends: [],
            verified: Math.random() > 0.7 // Simulation pour l'exemple
          } as UserProfile;
        });
      } catch (error) {
        console.error("Error in fetchFriends:", error);
        return [];
      }
    }
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
            friend={friend} 
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
