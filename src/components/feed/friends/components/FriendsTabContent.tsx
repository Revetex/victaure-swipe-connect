
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Friend } from "@/types/profile";
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
        // Get connections directly from user_connections table
        const { data: connections, error } = await supabase
          .from('user_connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            connection_type,
            visibility,
            created_at,
            updated_at,
            sender:profiles!sender_id(id, full_name, avatar_url, online_status, last_seen),
            receiver:profiles!receiver_id(id, full_name, avatar_url, online_status, last_seen)
          `)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) {
          console.error("Error fetching friends:", error);
          return [];
        }

        if (!connections) return [];

        // Format for UI consumption
        let friendsList = connections.map(conn => {
          const isSender = conn.sender_id === user.id;
          let friendData = isSender ? conn.receiver : conn.sender;
          
          // Vérification null pour friendData et créer un objet par défaut si nécessaire
          if (!friendData) {
            console.error("Friend data is null", conn);
            friendData = {
              id: isSender ? conn.receiver_id : conn.sender_id,
              full_name: "",
              avatar_url: null,
              online_status: false,
              last_seen: null
            };
          }
          
          // Vérification plus stricte du type
          if (typeof friendData !== 'object' || !('id' in friendData)) {
            console.error("Invalid friend data:", friendData);
            return null;
          }

          return {
            id: String(friendData.id || ''),
            full_name: friendData.full_name || '',
            avatar_url: friendData.avatar_url || null,
            online_status: !!friendData.online_status,
            last_seen: friendData.last_seen || null,
            role: 'professional',
            bio: '',
            phone: '',
            city: '',
            state: '',
            country: 'Canada',
            email: null,
            created_at: new Date().toISOString(),
            friends: [] // Maintenant obligatoire
          } as Friend;
        }).filter(Boolean) as Friend[];

        // Filter by online status if requested
        if (showOnlineOnly) {
          friendsList = friendsList.filter(friend => friend.online_status);
        }

        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          friendsList = friendsList.filter(friend => 
            (friend.full_name || '').toLowerCase().includes(query)
          );
        }

        // Calculate total pages
        setTotalPages(Math.ceil(friendsList.length / itemsPerPage));

        // Apply pagination
        const startIndex = (displayPage - 1) * itemsPerPage;
        return friendsList.slice(startIndex, startIndex + itemsPerPage);
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
