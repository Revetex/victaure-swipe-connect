
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

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
        
        return {
          connectionId: connection.id,
          userId: otherUser.id,
          fullName: otherUser.full_name,
          avatarUrl: otherUser.avatar_url,
          onlineStatus: otherUser.online_status,
          lastSeen: otherUser.last_seen,
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
