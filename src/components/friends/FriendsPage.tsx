
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/types/profile";
import { Loader } from "@/components/ui/loader";
import { FriendsList } from "@/components/feed/FriendsList";

export function FriendsPage() {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: acceptedRequests } = await supabase
        .from("friend_requests")
        .select(`
          sender:profiles!friend_requests_sender_id_fkey(
            id, full_name, avatar_url, online_status, last_seen
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id, full_name, avatar_url, online_status, last_seen
          )
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Mes amis</h1>
        <FriendsList />
      </div>
    </ScrollArea>
  );
}
