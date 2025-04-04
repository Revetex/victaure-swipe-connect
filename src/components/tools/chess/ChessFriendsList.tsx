import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Crown } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export function ChessFriendsList() {
  const { data: friends, isLoading } = useQuery({
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

  const { data: activeGames } = useQuery({
    queryKey: ["active-chess-games"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: games } = await supabase
        .from("chess_games")
        .select("*")
        .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`)
        .eq("status", "active");

      return games || [];
    }
  });

  const inviteFriend = async (friendId: string, friendName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if there's already an active game with this friend
      const { data: existingGames } = await supabase
        .from("chess_games")
        .select("*")
        .or(`and(white_player_id.eq.${user.id},black_player_id.eq.${friendId}),and(white_player_id.eq.${friendId},black_player_id.eq.${user.id})`)
        .eq("status", "active");

      if (existingGames && existingGames.length > 0) {
        toast.error("You already have an active game with this friend");
        return;
      }

      const { error } = await supabase.from("chess_games").insert({
        white_player_id: user.id,
        black_player_id: friendId,
        game_state: {},
        status: "active"
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="h-8 w-8 text-primary/50" />
        </motion.div>
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <div className="text-center py-4">
        <UserCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground mt-2">No friends available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] px-1">
      <div className="space-y-2">
        {friends.map((friend) => {
          const hasActiveGame = activeGames?.some(
            game => 
              (game.white_player_id === friend.id || game.black_player_id === friend.id) &&
              game.status === "active"
          );

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {friend.avatar_url ? (
                  <img
                    src={friend.avatar_url}
                    alt={friend.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
                <div>
                  <span className="font-medium">{friend.full_name}</span>
                  {hasActiveGame && (
                    <p className="text-xs text-muted-foreground">Game in progress</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => inviteFriend(friend.id, friend.full_name)}
                disabled={hasActiveGame}
                className="min-w-[80px]"
              >
                {hasActiveGame ? "Playing" : "Invite"}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
}