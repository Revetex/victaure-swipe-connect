
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
        // Find the friend profile (the one that's not the current user)
        const friendProfile = connection.sender_id === user.id 
          ? connection.receiver 
          : connection.sender;
        
        return {
          id: friendProfile.id,
          full_name: friendProfile.full_name || "Unnamed Friend",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false,
          // Default properties to satisfy UserProfile type
          email: "",
          role: "professional",
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        } as UserProfile;
      });
    }
  });

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-sm font-medium mb-2">Jouer avec un ami</h3>
      {friends.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n'avez pas encore d'amis pour jouer.
        </p>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/10">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar_url} />
                  <AvatarFallback>{friend.full_name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{friend.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.online_status ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSelectFriend(friend.id)}
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
