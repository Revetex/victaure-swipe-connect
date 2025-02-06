import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function FriendsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  useEffect(() => {
    const channel = supabase
      .channel('friend-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['friends'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (!friends?.length) return null;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <h3 className="font-semibold mb-4">Mes connections</h3>
      <AnimatePresence>
        <div className="space-y-3">
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {friend.avatar_url ? (
                    <img
                      src={friend.avatar_url}
                      alt={friend.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <ProfileNameButton 
                  profile={friend}
                  className="p-0 h-auto text-sm hover:underline"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dashboard/messages?receiver=${friend.id}`)}
                className="ml-auto"
              >
                Message
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}