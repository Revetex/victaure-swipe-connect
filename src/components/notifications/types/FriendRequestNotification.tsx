import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";

interface FriendRequestNotificationProps {
  id: string;
  message: string;
  onDelete: (id: string) => void;
}

export function FriendRequestNotification({ id, message, onDelete }: FriendRequestNotificationProps) {
  const handleAcceptFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: senderId,
          title: 'Demande acceptée',
          message: 'Votre demande d\'ami a été acceptée',
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
      }

      onDelete(id);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      onDelete(id);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="default"
        className="flex items-center gap-1"
        onClick={handleAcceptFriend}
      >
        <UserPlus className="h-4 w-4" />
        Accepter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={handleRejectFriend}
      >
        <UserMinus className="h-4 w-4" />
        Refuser
      </Button>
    </div>
  );
}