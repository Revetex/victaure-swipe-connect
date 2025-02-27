

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Friend, convertOnlineStatusToBoolean } from "@/types/profile";

export function useFriendsList() {
  const { user } = useAuth();

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends-for-messages", user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Récupérer les connections de type ami avec statut accepté
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

        // Transformer les connexions en amis
        const friendsList: Friend[] = connections.map(conn => {
          const isSender = conn.sender_id === user.id;
          
          return {
            id: isSender ? conn.receiver_id : conn.sender_id,
            full_name: isSender ? conn.receiver_name : conn.sender_name,
            avatar_url: isSender ? conn.receiver_avatar : conn.sender_avatar,
            email: null, // Champ requis par l'interface Friend
            role: 'professional',
            bio: null,
            phone: null,
            city: null,
            state: null,
            country: null,
            skills: [],
            created_at: conn.created_at,
            friendship_id: conn.id,
            status: conn.status,
            online_status: true, // Valeur par défaut
            last_seen: null, // Valeur par défaut
            friends: [] // Ajouter la propriété friends obligatoire
          };
        });

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
