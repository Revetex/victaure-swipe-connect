import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendListHeader } from "./FriendListHeader";
import { FriendItem } from "./FriendItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";

export function ConnectionsSection() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

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
            last_seen,
            role,
            bio,
            city,
            state,
            country,
            skills
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            full_name,
            avatar_url,
            online_status,
            last_seen,
            role,
            bio,
            city,
            state,
            country,
            skills
          ),
          status
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq("status", "accepted");

      return friendRequests?.map(request => {
        const friend = request.sender.id === user.id ? request.receiver : request.sender;
        return {
          id: friend.id,
          full_name: friend.full_name,
          avatar_url: friend.avatar_url,
          online_status: friend.online_status,
          last_seen: friend.last_seen,
          role: friend.role,
          bio: friend.bio,
          city: friend.city,
          state: friend.state,
          country: friend.country,
          skills: friend.skills,
          email: '',
          phone: null,
          latitude: null,
          longitude: null
        };
      }) || [];
    }
  });

  const handleMessage = (friendId: string) => {
    navigate(`/dashboard/messages/${friendId}`);
  };

  return (
    <div>
      <FriendListHeader 
        icon={<User className="h-5 w-5 text-primary" />}
        title="Mes connections"
      />
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {friends?.map((friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              onMessage={handleMessage}
            />
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
  );
}