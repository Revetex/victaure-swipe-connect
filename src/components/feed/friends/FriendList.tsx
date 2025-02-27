
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/profile";
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
        // Au lieu d'utiliser la relation qui cause l'erreur, faisons deux requêtes séparées
        // D'abord, récupérons les connexions de l'utilisateur
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections')
          .select('id, sender_id, receiver_id, status, connection_type')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) {
          console.error("Error loading connections:", connectionsError);
          return [];
        }

        if (!connections || connections.length === 0) return [];

        // Maintenant, récupérons les profils correspondants
        const friendsProfiles = [];
        
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

          // Créer un profil complet en combinant les données
          const profile: UserProfile = {
            id: profileData.id,
            full_name: profileData.full_name || '',
            avatar_url: profileData.avatar_url || null,
            email: profileData.email || '',
            role: role,
            bio: profileData.bio || '',
            phone: profileData.phone || '',
            city: profileData.city || '',
            state: profileData.state || '',
            country: profileData.country || '',
            skills: profileData.skills || [],
            online_status: !!profileData.online_status,
            last_seen: profileData.last_seen || null,
            created_at: profileData.created_at || new Date().toISOString(),
            friends: [] // Propriété obligatoire
          };
          
          friendsProfiles.push(profile);
        }

        // Appliquer les filtres
        let filteredFriends = friendsProfiles;
        
        if (showOnlineOnly) {
          filteredFriends = filteredFriends.filter(friend => friend.online_status);
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredFriends = filteredFriends.filter(friend => 
            (friend.full_name || '').toLowerCase().includes(query)
          );
        }
        
        // Appliquer la pagination
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
