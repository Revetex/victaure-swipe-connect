
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

interface ChessFriendsListProps {
  onInviteFriend: (friendId: string) => void;
}

export function ChessFriendsList({ onInviteFriend }: ChessFriendsListProps) {
  const { data: onlineFriends = [], isLoading } = useQuery({
    queryKey: ["online-friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findAcceptedConnections(user.id);
      
      if (error) {
        console.error("Error fetching friends:", error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections
        .map(connection => {
          // Déterminer quel profil représente l'ami
          const friendProfile = connection.sender_id === user.id 
            ? connection.receiver 
            : connection.sender;
            
          if (!friendProfile) return null;
          
          return {
            id: friendProfile.id,
            full_name: friendProfile.full_name,
            avatar_url: friendProfile.avatar_url,
            online_status: friendProfile.online_status,
            last_seen: friendProfile.last_seen,
          };
        })
        .filter(friend => friend !== null)
        .sort((a, b) => {
          // Trier par statut en ligne, puis par date de dernière activité
          if (a.online_status && !b.online_status) return -1;
          if (!a.online_status && b.online_status) return 1;
          if (a.last_seen && b.last_seen) {
            return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
          }
          return 0;
        });
    },
    refetchInterval: 60000, // Actualiser toutes les minutes
  });
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-5 w-5 border-2 border-primary/50 border-t-primary rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Chargement de vos amis...</p>
      </div>
    );
  }
  
  if (onlineFriends.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Aucun ami connecté pour le moment</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-2">
        {onlineFriends.map(friend => (
          <div key={friend.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar_url} />
                  <AvatarFallback>{friend.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${friend.online_status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">{friend.full_name}</h4>
                <p className="text-xs text-muted-foreground">
                  {friend.online_status 
                    ? "En ligne" 
                    : `Vu ${formatDistanceToNow(new Date(friend.last_seen), { addSuffix: true, locale: fr })}`}
                </p>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              className="h-8"
              onClick={() => onInviteFriend(friend.id)}
            >
              Inviter
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
