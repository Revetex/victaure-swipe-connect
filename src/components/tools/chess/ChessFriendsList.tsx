
import { useState } from "react";
import { Friend } from "@/types/profile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChessFriendsListProps {
  onSelectFriend: (friendId: string) => void;
}

export function ChessFriendsList({ onSelectFriend }: ChessFriendsListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["chessFriends", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get connections from the view
      const { data, error } = await supabase
        .from("user_connections_view")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted")
        .eq("connection_type", "friend");

      if (error) {
        console.error("Error fetching friends:", error);
        toast.error("Erreur lors du chargement des amis");
        return [];
      }

      // Map connections to Friend objects
      const friends: Friend[] = data.map(conn => {
        const isUserSender = conn.sender_id === user.id;
        
        return {
          id: isUserSender ? conn.receiver_id : conn.sender_id,
          full_name: isUserSender ? conn.receiver_name : conn.sender_name,
          avatar_url: isUserSender ? conn.receiver_avatar : conn.sender_avatar,
          online_status: false, // Default value
          last_seen: null,
          friendship_id: conn.id,
          status: conn.status,
          friends: []
        };
      });

      // Get online status for friends
      if (friends.length > 0) {
        const friendIds = friends.map(f => f.id);
        
        const { data: onlineData } = await supabase
          .from("profiles")
          .select("id, online_status, last_seen")
          .in("id", friendIds);
          
        if (onlineData) {
          // Update online status
          friends.forEach(friend => {
            const profile = onlineData.find(p => p.id === friend.id);
            if (profile) {
              friend.online_status = profile.online_status;
              friend.last_seen = profile.last_seen;
            }
          });
        }
      }

      return friends;
    },
    enabled: !!user,
  });

  // Filter friends by search term
  const filteredFriends = searchTerm
    ? friends.filter(friend =>
        friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : friends;

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="animate-pulse h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-4">
            <div className="animate-pulse h-10 w-10 bg-zinc-800 rounded-full"></div>
            <div className="animate-pulse h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredFriends.length) {
    return (
      <div className="p-4 text-center text-zinc-400">
        {searchTerm ? "Aucun ami trouvé" : "Aucun ami disponible"}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <input
        type="text"
        placeholder="Rechercher un ami..."
        className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="mt-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent space-y-2">
        {filteredFriends.map(friend => (
          <Button
            key={friend.id}
            variant="outline"
            className="w-full flex items-center justify-start gap-3 p-2 hover:bg-zinc-800"
            onClick={() => onSelectFriend(friend.id)}
          >
            <div className="relative">
              <UserAvatar
                user={{
                  id: friend.id,
                  name: friend.full_name || '',
                  image: friend.avatar_url
                }}
                className="h-8 w-8"
              />
              {friend.online_status && (
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-zinc-900"></span>
              )}
            </div>
            <span>{friend.full_name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
