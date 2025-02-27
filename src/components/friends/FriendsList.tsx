
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

interface FriendsListProps {
  searchQuery?: string;
}

export function FriendsList({ searchQuery = "" }: FriendsListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const {
    data: friends = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["friends-list", user?.id, searchQuery],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // Get connections from user_connections table
        const { data: connections, error } = await supabase
          .from('user_connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            status,
            sender:profiles!sender_id(id, full_name, avatar_url, online_status, last_seen),
            receiver:profiles!receiver_id(id, full_name, avatar_url, online_status, last_seen)
          `)
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) {
          console.error("Error loading friends:", error);
          return [];
        }

        if (!connections) return [];

        // Format connections as UserProfiles
        const friendsList = connections.map(conn => {
          const isSender = conn.sender_id === user.id;
          const friendData = isSender ? conn.receiver : conn.sender;
          
          if (!friendData) return null;

          // Create a UserProfile with required fields
          const profile: any = {
            id: friendData.id,
            full_name: friendData.full_name || '',
            avatar_url: friendData.avatar_url || null,
            email: '',
            role: 'professional',
            bio: '',
            phone: '',
            city: '',
            state: '',
            country: '',
            skills: [],
            online_status: friendData.online_status,
            last_seen: friendData.last_seen,
            created_at: new Date().toISOString(),
            connection_id: conn.id, // store the connection id for easy removal
          };
          
          return profile;
        }).filter(Boolean);

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return friendsList.filter(friend => 
            (friend.full_name || '').toLowerCase().includes(query)
          );
        }
        
        return friendsList;
      } catch (error) {
        console.error("Error fetching friends:", error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  const handleRemoveFriend = async (connectionId: string, friendName: string) => {
    if (!user?.id) return;
    
    try {
      setRemovingId(connectionId);
      
      // Delete the connection
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
      
      toast.success(`${friendName} a été retiré(e) de vos amis`);
      refetch();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Erreur lors de la suppression de l\'ami');
    } finally {
      setRemovingId(null);
    }
  };

  const handleMessage = (friendId: string) => {
    navigate(`/messages?receiver=${friendId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-card/40">
        {searchQuery ? (
          <p className="text-muted-foreground">
            Aucun ami trouvé pour "{searchQuery}"
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Vous n'avez pas encore d'amis
            </p>
            <Button
              onClick={() => navigate("/friends/search")}
              size="sm"
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Trouver des amis
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {friends.map((friend: any) => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={friend.avatar_url || "/placeholder-avatar.png"}
                alt={friend.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                  friend.online_status ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">{friend.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {friend.online_status
                  ? "En ligne"
                  : friend.last_seen
                  ? `Vu(e) ${new Date(friend.last_seen).toLocaleDateString()}`
                  : "Hors ligne"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMessage(friend.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Message</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() =>
                handleRemoveFriend(friend.connection_id, friend.full_name)
              }
              disabled={removingId === friend.connection_id}
            >
              {removingId === friend.connection_id ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <UserMinus className="h-4 w-4" />
              )}
              <span className="sr-only">Retirer</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
