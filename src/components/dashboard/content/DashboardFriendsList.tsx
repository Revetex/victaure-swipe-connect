
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Friend } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { cn } from "@/lib/utils";
import { MessageCircle, User } from "lucide-react";

export function DashboardFriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();

  useEffect(() => {
    if (!user) return;

    const loadFriends = async () => {
      try {
        // Au lieu d'utiliser rpc, utilisons une requête directe sur la table friend_requests
        const { data: acceptedFriends, error } = await supabase
          .from('friend_requests')
          .select(`
            id,
            sender:profiles!friend_requests_sender_id_fkey(
              id, 
              full_name, 
              avatar_url, 
              online_status,
              last_seen
            ),
            receiver:profiles!friend_requests_receiver_id_fkey(
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            )
          `)
          .eq('status', 'accepted')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .limit(5);
        
        if (error) throw error;

        // Transformer les données pour correspondre au format Friend[]
        const transformedFriends: Friend[] = [];
        
        acceptedFriends?.forEach(friend => {
          const isSender = friend.sender.id === user.id;
          const friendProfile = isSender ? friend.receiver : friend.sender;
          
          transformedFriends.push({
            id: friendProfile.id,
            full_name: friendProfile.full_name,
            avatar_url: friendProfile.avatar_url,
            online_status: friendProfile.online_status,
            last_seen: friendProfile.last_seen
          });
        });

        setFriends(transformedFriends);
      } catch (error) {
        console.error("Error loading friends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriends();
  }, [user]);

  const handleChat = (friend: Friend) => {
    setReceiver({
      id: friend.id,
      full_name: friend.full_name || '',
      avatar_url: friend.avatar_url,
      online_status: friend.online_status ? 'online' : 'offline',
      last_seen: friend.last_seen,
      role: 'professional',
      bio: null,
      phone: null,
      city: null,
      state: null,
      country: '',
      skills: [],
      latitude: null,
      longitude: null,
      certifications: [],
      education: [],
      experiences: [],
      friends: []
    });
    setShowConversation(true);
    navigate('/messages');
  };

  const handleViewProfile = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };

  if (isLoading) {
    return (
      <Card className="p-4 h-full animate-pulse">
        <div className="flex flex-col h-full justify-center items-center gap-4">
          <div className="w-24 h-6 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="w-full h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-card/50 text-card-foreground font-medium">
        Amis
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {friends.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Vous n'avez pas encore d'amis
          </div>
        ) : (
          <ul className="space-y-2">
            {friends.map((friend) => (
              <li key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 p-2">
                  <div className="relative">
                    <UserAvatar 
                      user={{ 
                        id: friend.id, 
                        name: friend.full_name || '', 
                        image: friend.avatar_url 
                      }} 
                    />
                    {friend.online_status && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm truncate max-w-[120px]">
                    {friend.full_name || 'Utilisateur'}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-8 h-8 p-0"
                    onClick={() => handleViewProfile(friend.id)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-8 h-8 p-0"
                    onClick={() => handleChat(friend)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={cn(
        "p-3 border-t text-center",
        friends.length === 0 ? "bg-slate-50 dark:bg-slate-900" : ""
      )}>
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => navigate('/connections')}
        >
          {friends.length > 0 ? "Voir tous les amis" : "Trouver des amis"}
        </Button>
      </div>
    </Card>
  );
}
