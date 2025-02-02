import { useQuery } from "@tanstack/react-query";
import { CircleDot, User, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
}

export function FriendsList() {
  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: friendRequests, error: requestsError } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (requestsError) throw requestsError;

      const friendIds = friendRequests.reduce((acc: string[], request) => {
        if (request.sender_id === user.id) {
          acc.push(request.receiver_id);
        } else {
          acc.push(request.sender_id);
        }
        return acc;
      }, []);

      if (friendIds.length === 0) return [];

      const { data: friendProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, online_status, last_seen')
        .in('id', friendIds);

      if (profilesError) throw profilesError;

      return friendProfiles as Friend[];
    }
  });

  if (!friends || friends.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-2">Mes amis</h3>
        <p className="text-sm text-muted-foreground">Aucun ami pour le moment</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg mb-2">Mes amis</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {friends?.map((friend: Friend) => (
              <div key={friend.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1">{friend.full_name}</span>
                {friend.online_status && (
                  <CircleDot className="h-4 w-4 text-green-500" />
                )}
                <MessageCircle className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}