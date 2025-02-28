
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";
import { UserProfile } from "@/types/profile";

interface Connection {
  connectionId: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  onlineStatus: boolean;
  lastSeen: string;
  createdAt: string;
}

export function useConnections() {
  const { data: connections = [], isLoading, error, refetch } = useQuery({
    queryKey: ["user-connections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      
      if (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
      
      if (!data) return [];

      return data.map(connection => {
        // Déterminer qui est l'autre utilisateur (pas l'utilisateur courant)
        const otherUser = connection.sender_id === user.id 
          ? connection.receiver 
          : connection.sender;
        
        if (!otherUser) {
          console.error("Other user not found for connection:", connection);
          return {
            connectionId: connection.id,
            userId: "",
            fullName: "Utilisateur inconnu",
            avatarUrl: "",
            onlineStatus: false,
            lastSeen: new Date().toISOString(),
            createdAt: connection.created_at
          };
        }
        
        return {
          connectionId: connection.id,
          userId: otherUser.id || "",
          fullName: otherUser.full_name || "Utilisateur inconnu",
          avatarUrl: otherUser.avatar_url || "",
          onlineStatus: otherUser.online_status || false,
          lastSeen: otherUser.last_seen || new Date().toISOString(),
          createdAt: connection.created_at
        };
      });
    }
  });

  return {
    connections,
    isLoading,
    error,
    refetch
  };
}
