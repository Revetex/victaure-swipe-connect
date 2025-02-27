
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Friend } from "@/types/profile";

export function useFriendsList() {
  const { user } = useAuth();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends-for-messages", user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Au lieu d'utiliser user_connections_view qui cause des erreurs, utilisons deux requêtes séparées
        // D'abord, récupérons les connexions de l'utilisateur
        const { data: connections, error: connectionsError } = await supabase
          .from('user_connections')
          .select('id, sender_id, receiver_id, status, connection_type, created_at, updated_at')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) {
          console.error("Error loading connections:", connectionsError);
          return [];
        }

        if (!connections || connections.length === 0) return [];

        // Maintenant, récupérons les profils correspondants
        const friendsList: Friend[] = [];
        
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

          // Créer un objet Friend
          const friend: Friend = {
            id: profileData.id,
            full_name: profileData.full_name || '',
            avatar_url: profileData.avatar_url || null,
            email: profileData.email || null,
            role: profileData.role || 'professional',
            bio: profileData.bio || null,
            phone: profileData.phone || null,
            city: profileData.city || null,
            state: profileData.state || null,
            country: profileData.country || null,
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

        // Trier les amis - d'abord ceux qui sont en ligne
        return friendsList.sort((a, b) => {
          if (a.online_status && !b.online_status) return -1;
          if (!a.online_status && b.online_status) return 1;
          return (a.full_name || "").localeCompare(b.full_name || "");
        });
      } catch (error) {
        console.error("Error fetching friends:", error);
        return [];
      }
    },
  });

  return { friends, isLoadingFriends };
}
