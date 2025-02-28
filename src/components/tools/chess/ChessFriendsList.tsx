
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

interface ChessFriendsListProps {
  onSelectFriend: (friendId: string) => void;
}

export function ChessFriendsList({ onSelectFriend }: ChessFriendsListProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: friends = [] } = useQuery({
    queryKey: ["chess-friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: connections, error } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      
      if (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(connection => {
        // Déterminer quel profil représente l'ami (pas l'utilisateur courant)
        const friendProfile = connection.sender_id === user.id 
          ? connection.receiver 
          : connection.sender;
        
        return {
          id: friendProfile.id,
          full_name: friendProfile.full_name || "",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false
        };
      });
    }
  });

  const handleInvite = async (friendId: string) => {
    setIsLoading(true);
    try {
      // Ici, nous pourrions envoyer une invitation à jouer aux échecs
      setTimeout(() => {
        onSelectFriend(friendId);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error inviting friend to play:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-2">
      <h3 className="text-lg font-semibold mb-3">Amis en ligne</h3>
      
      {friends.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-3">
          Aucun ami connecté pour le moment
        </p>
      ) : (
        <div className="space-y-2">
          {friends.map(friend => (
            <div 
              key={friend.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={friend.avatar_url || ""} />
                    <AvatarFallback>{friend.full_name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  {friend.online_status && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{friend.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.online_status ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="text-xs"
                disabled={!friend.online_status || isLoading}
                onClick={() => handleInvite(friend.id)}
              >
                Inviter
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
