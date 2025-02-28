
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/types/profile";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

interface ChessFriendsListProps {
  onSelectOpponent: (userId: string) => void;
}

export function ChessFriendsList({ onSelectOpponent }: ChessFriendsListProps) {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["chess-friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      
      if (error) {
        console.error("Error fetching friends:", error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(connection => {
        // Déterminer quel profil représente l'ami (pas l'utilisateur courant)
        const friendProfile = connection.sender_id === user.id 
          ? connection.receiver 
          : connection.sender;
        
        if (!friendProfile) {
          console.error("Friend profile not found for connection:", connection);
          return {
            id: "",
            full_name: "Utilisateur inconnu",
            avatar_url: "",
            online_status: false,
            last_seen: new Date().toISOString(),
            email: "",
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          } as UserProfile;
        }
        
        return {
          id: friendProfile.id || "",
          full_name: friendProfile.full_name || "Utilisateur inconnu",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false,
          last_seen: friendProfile.last_seen || new Date().toISOString(),
          email: "",
          certifications: [],
          education: [],
          experiences: [],
          friends: []
        } as UserProfile;
      });
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement des amis...</div>;
  }

  if (friends.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Aucun ami disponible</p>
        <p className="text-xs mt-1">Ajoutez des amis pour jouer avec eux</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {friends
          .sort((a, b) => (a.online_status === b.online_status ? 0 : a.online_status ? -1 : 1))
          .map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-card/50">
              <div className="flex items-center gap-3">
                <Avatar className="relative">
                  <AvatarImage src={friend.avatar_url || ''} />
                  <AvatarFallback>{friend.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  {friend.online_status && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{friend.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.online_status ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSelectOpponent(friend.id)}
                disabled={!friend.online_status}
              >
                Inviter
              </Button>
            </div>
          ))}
      </div>
    </ScrollArea>
  );
}
