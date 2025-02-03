import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot, MessageCircle, UserMinus, UserX } from "lucide-react";
import { FriendPreview } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FriendItemProps {
  friend: FriendPreview;
  onMessage: (friendId: string) => void;
}

export function FriendItem({ friend, onMessage }: FriendItemProps) {
  const [showProfile, setShowProfile] = useState(false);

  const handleRemoveFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${friend.id},receiver_id.eq.${friend.id}`);

      if (error) throw error;
      toast.success(`${friend.full_name} a été retiré de vos connections`);
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connection");
    }
  };

  const handleBlockUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, remove from friends if they are friends
      await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${friend.id},receiver_id.eq.${friend.id}`);

      // Then add to blocked users
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: friend.id
        });

      if (error) throw error;
      toast.success(`${friend.full_name} a été bloqué`);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error("Erreur lors du blocage de l'utilisateur");
    }
  };

  return (
    <>
      <div 
        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group relative cursor-pointer"
        onClick={() => setShowProfile(true)}
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
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(friend.id);
            }}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRemoveFriend}
          >
            <UserMinus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBlockUser}
          >
            <UserX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProfilePreview
        profile={friend}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}