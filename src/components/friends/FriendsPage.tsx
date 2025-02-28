
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, UserMinus, Zap } from "lucide-react";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export function FriendsPage() {
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: friends = [], isLoading, refetch } = useQuery({
    queryKey: ["friends-list", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data: connections, error } = await friendRequestsAdapter.findAcceptedConnections(currentUser.id);
      
      if (error) {
        console.error('Error fetching friends:', error);
        return [];
      }
      
      if (!connections) return [];
      
      return connections.map(connection => {
        const friendProfile = connection.sender_id === currentUser.id 
          ? connection.receiver 
          : connection.sender;
          
        if (!friendProfile) return null;
        
        return {
          id: friendProfile.id,
          full_name: friendProfile.full_name || "Utilisateur",
          avatar_url: friendProfile.avatar_url || "",
          online_status: friendProfile.online_status || false,
          last_seen: friendProfile.last_seen || new Date().toISOString(),
          connectionId: connection.id
        };
      }).filter(Boolean);
    },
    enabled: !!currentUser
  });
  
  const handleRemoveFriend = async (connectionId: string, friendName: string) => {
    try {
      const { error } = await friendRequestsAdapter.deleteFriendRequest(connectionId);
      
      if (error) throw error;
      
      toast.success(`${friendName} a été retiré de vos amis`);
      refetch();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de l'ami");
    }
  };
  
  const handleInviteToGame = (friendId: string, friendName: string) => {
    // Logique pour inviter à un jeu
    toast.success(`Invitation envoyée à ${friendName}`);
  };
  
  const handleSendMessage = (friendId: string) => {
    // Pour l'instant, juste rediriger vers les messages
    // La logique de création de conversation sera dans la page de messages
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Mes amis</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes amis ({friends.length})</h1>
        <Button asChild>
          <Link to="/friends/search">Rechercher des profils</Link>
        </Button>
      </div>
      
      {friends.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Vous n'avez pas encore d'amis</h2>
          <p className="text-muted-foreground mb-6">Commencez à vous connecter avec d'autres professionnels</p>
          <Button asChild>
            <Link to="/friends/search">Rechercher des profils</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {friends.map(friend => (
            <div 
              key={friend.id} 
              className="bg-card p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar_url} />
                    <AvatarFallback>{friend.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background
                      ${friend.online_status ? 'bg-green-500' : 'bg-gray-400'}`}
                  ></span>
                </div>
                
                <div>
                  <Link 
                    to={`/profile/${friend.id}`} 
                    className="font-medium hover:underline"
                  >
                    {friend.full_name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {friend.online_status 
                      ? "En ligne" 
                      : `Vu ${formatDistanceToNow(new Date(friend.last_seen), { 
                          addSuffix: true, 
                          locale: fr 
                        })}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  asChild
                >
                  <Link to={`/messages?to=${friend.id}`}>
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Envoyer un message</span>
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleInviteToGame(friend.id, friend.full_name)}
                  title="Inviter à un jeu"
                >
                  <Zap className="h-5 w-5" />
                  <span className="sr-only">Inviter à un jeu</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveFriend(friend.connectionId, friend.full_name)}
                  title="Retirer des amis"
                >
                  <UserMinus className="h-5 w-5" />
                  <span className="sr-only">Retirer des amis</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
