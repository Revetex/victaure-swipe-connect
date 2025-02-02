import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CircleDot, User, MessageCircle, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function FriendsList() {
  const navigate = useNavigate();
  
  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: friendRequests } = await supabase
        .from("friend_requests")
        .select(`
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
          ),
          status
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      return friendRequests?.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      }) || [];
    }
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: requests } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("receiver_id", user.id)
        .eq("status", "pending");

      return requests || [];
    }
  });

  const handleMessage = (friendId: string) => {
    navigate(`/dashboard/messages/${friendId}`);
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Mes amis
        </h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {friends?.map((friend: UserProfile) => (
              <div 
                key={friend.id} 
                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={friend.avatar_url || ''} alt={friend.full_name || ''} />
                  <AvatarFallback>
                    {friend.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{friend.full_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CircleDot className={`h-2 w-2 ${friend.online_status ? "text-green-500" : "text-gray-300"}`} />
                    {friend.online_status ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleMessage(friend.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!friends || friends.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun ami pour le moment</p>
                <p className="text-sm">Commencez à ajouter des amis!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {pendingRequests && pendingRequests.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Demandes en attente
          </h3>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.sender.id} 
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={request.sender.avatar_url || ''} alt={request.sender.full_name || ''} />
                    <AvatarFallback>
                      {request.sender.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.sender.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Souhaite vous ajouter comme ami
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}