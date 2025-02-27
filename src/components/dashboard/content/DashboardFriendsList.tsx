
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/UserAvatar";
import { Friend, UserProfile, friendToUserProfile, transformConnection } from "@/types/profile";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useReceiver } from "@/hooks/useReceiver";
import { useNavigate } from "react-router-dom";

export function DashboardFriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { setReceiver, setShowConversation } = useReceiver();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const { data: connections, error } = await supabase
          .from('user_connections_view')
          .select('*')
          .eq('status', 'accepted')
          .eq('connection_type', 'friend')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .limit(5);

        if (error) {
          console.error("Error fetching friends:", error);
          setFriends([]);
          return;
        }

        if (!connections || connections.length === 0) {
          setFriends([]);
          return;
        }

        // Transformer les connexions en amis
        const friendsList = connections.map(conn => 
          transformConnection(conn, user.id)
        );

        // Trier par online_status puis last_seen
        const sortedFriends = friendsList.sort((a, b) => {
          if (a.online_status && !b.online_status) return -1;
          if (!a.online_status && b.online_status) return 1;
          
          const dateA = a.last_seen ? new Date(a.last_seen) : new Date(0);
          const dateB = b.last_seen ? new Date(b.last_seen) : new Date(0);
          
          return dateB.getTime() - dateA.getTime();
        });

        setFriends(sortedFriends);
      } catch (error) {
        console.error("Error in fetchFriends:", error);
        setFriends([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  const startChat = (friend: Friend) => {
    // Convertir Friend en UserProfile
    const profile = friendToUserProfile(friend);
    
    setReceiver({
      id: profile.id,
      full_name: profile.full_name || "",
      avatar_url: profile.avatar_url,
      online_status: profile.online_status,
      email: profile.email,
      role: profile.role,
      bio: profile.bio,
      last_seen: profile.last_seen
    });
    
    setShowConversation(true);
    navigate("/messages");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Vos connexions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-muted rounded w-24"></div>
                  <div className="h-2 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground text-sm">
            Vous n'avez pas encore de connexions
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                onClick={() => startChat(friend)}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg p-1 transition-colors"
              >
                <div className="relative">
                  <UserAvatar
                    user={{
                      id: friend.id,
                      name: friend.full_name || "",
                      image: friend.avatar_url,
                    }}
                    className="h-8 w-8"
                  />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                      friend.online_status ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {friend.full_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {friend.online_status
                      ? "En ligne"
                      : friend.last_seen
                      ? `Vu ${formatDistanceToNow(
                          new Date(friend.last_seen),
                          { addSuffix: true, locale: fr }
                        )}`
                      : "Hors ligne"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
