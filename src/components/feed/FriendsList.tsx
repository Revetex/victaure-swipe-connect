import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CircleDot, User, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
}

export function FriendsList() {
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

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Mes amis</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {friends?.map((friend: Friend) => (
              <div key={friend.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1">{friend.full_name}</span>
                <CircleDot className={`h-3 w-3 ${friend.online_status ? "text-green-500" : "text-gray-300"}`} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {pendingRequests && pendingRequests.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Demandes en attente</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div key={request.sender.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="flex-1">{request.sender.full_name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}