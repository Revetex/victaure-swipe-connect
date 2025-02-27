
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type FriendDetail = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean;
  last_seen: string | null;
};

export const useFriendsList = () => {
  const [friends, setFriends] = useState<FriendDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) {
        setFriends([]);
        setIsLoading(false);
        return;
      }

      try {
        // Obtenir les connexions d'amis depuis user_connections
        const { data, error } = await supabase
          .from('user_connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            sender:profiles!sender_id(id, full_name, avatar_url, online_status, last_seen),
            receiver:profiles!receiver_id(id, full_name, avatar_url, online_status, last_seen)
          `)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) {
          console.error("Error fetching friends:", error);
          setFriends([]);
          return;
        }

        // Transformer les données pour obtenir une liste d'amis
        const friendsList = data.map(connection => {
          // Déterminer si l'utilisateur est l'expéditeur ou le destinataire
          const friend = connection.sender_id === user.id 
            ? connection.receiver 
            : connection.sender;

          return {
            id: friend.id,
            full_name: friend.full_name,
            avatar_url: friend.avatar_url,
            online_status: friend.online_status || false,
            last_seen: friend.last_seen
          };
        });

        setFriends(friendsList);
      } catch (err) {
        console.error("Failed to fetch friends list:", err);
        setFriends([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return { friends, isLoading };
};
