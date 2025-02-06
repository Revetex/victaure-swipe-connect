import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export function ChessFriendsList() {
  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!friend_requests_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .eq("status", "accepted")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!acceptedRequests) return [];

      return acceptedRequests.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return friend;
      });
    }
  });

  const inviteFriend = async (friendId: string, friendName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("chess_games").insert({
        white_player_id: user.id,
        black_player_id: friendId,
        game_state: {},
      });

      if (error) throw error;

      await supabase.from("notifications").insert({
        user_id: friendId,
        title: "Chess Game Invitation",
        message: `${user.email} has invited you to play chess!`,
      });

      toast.success(`Invitation sent to ${friendName}`);
    } catch (error) {
      console.error("Error inviting friend:", error);
      toast.error("Failed to send invitation");
    }
  };

  if (!friends?.length) {
    return (
      <div className="text-center py-4">
        <UserCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground mt-2">No friends available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
            <div className="flex items-center gap-2">
              {friend.avatar_url ? (
                <img
                  src={friend.avatar_url}
                  alt={friend.full_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircle className="w-8 h-8" />
              )}
              <span className="font-medium">{friend.full_name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inviteFriend(friend.id, friend.full_name)}
            >
              Invite
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}