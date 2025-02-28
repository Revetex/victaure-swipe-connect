
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
          .from('user_connections')
          .select('id, sender_id, receiver_id, status, connection_type, created_at, updated_at')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) {
          console.error("Error fetching connections:", connectionsError);
          return [];
        }

        if (!connections || connections.length === 0) return [];

        // Maintenant, récupérons les profils correspondants
        let friendsList: Friend[] = [];
        
        for (const connection of connections) {
          const friendId = connection.sender_id === user.id ? connection.receiver_id : connection.sender_id;
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', friendId)
            .single();
          
          if (profileError) {
            console.error(`Error fetching profile for ${friendId}:`, profileError);
            continue;
          }
          
          if (!profileData) continue;

          // Déterminer le rôle valide à partir des données du profil
          let role: UserRole = 'professional';
          
          if (profileData.role === 'professional' || 
              profileData.role === 'business' || 
              profileData.role === 'admin' || 
              profileData.role === 'freelancer' || 
              profileData.role === 'student') {
            role = profileData.role as UserRole;
          }

          // Créer un profil d'ami en combinant les données
          const friend: Friend = {
            id: profileData.id,
            full_name: profileData.full_name || '',
            avatar_url: profileData.avatar_url || null,
            email: profileData.email || null,
            role: role,
            bio: profileData.bio || '',
            phone: profileData.phone || '',
            city: profileData.city || '',
            state: profileData.state || '',
            country: profileData.country || 'Canada',
            skills: profileData.skills || [],
            online_status: !!profileData.online_status,
            last_seen: profileData.last_seen || null,
            created_at: profileData.created_at || new Date().toISOString(),
            friendship_id: connection.id,
            status: connection.status,
            friends: [] // Propriété obligatoire
          };
          
          friendsList.push(friend);
        }

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
