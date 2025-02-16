
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot, MessageCircle, UserMinus, UserX } from "lucide-react";
import { FriendPreview } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FriendItemProps {
  friend: FriendPreview;
}

export function FriendItem({ friend }: FriendItemProps) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/messages?receiver=${friend.id}`);
  };

  const handleRemoveFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or('sender_id.eq.' + user.id + ',receiver_id.eq.' + friend.id + ',' +
            'sender_id.eq.' + friend.id + ',receiver_id.eq.' + user.id);

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

      // First delete any existing friend requests
      await supabase
        .from('friend_requests')
        .delete()
        .or('sender_id.eq.' + user.id + ',receiver_id.eq.' + friend.id + ',' +
            'sender_id.eq.' + friend.id + ',receiver_id.eq.' + user.id);

      // Then block the user
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

  const userProfile = {
    id: friend.id,
    email: '',
    full_name: friend.full_name,
    avatar_url: friend.avatar_url,
    role: '',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: [],
    latitude: null,
    longitude: null,
    online_status: friend.online_status,
    last_seen: friend.last_seen
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
          "hover:bg-muted/50 group relative cursor-pointer"
        )}
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
            <CircleDot className={cn(
              "h-2 w-2",
              friend.online_status ? "text-green-500" : "text-gray-300"
            )} />
            {friend.online_status ? "En ligne" : "Hors ligne"}
          </p>
        </div>
        <div className={cn(
          "flex gap-1 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleMessageClick}
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
        profile={userProfile}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}
