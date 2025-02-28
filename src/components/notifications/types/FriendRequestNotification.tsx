
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

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

      // Obtenir l'ID de la demande
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
      
      if (!pendingRequests || pendingRequests.length === 0) {
        throw new Error("Demande d'ami introuvable");
      }
      
      const request = pendingRequests.find(req => 
        req.sender_id === senderId && req.receiver_id === user.id);
      
      if (!request) {
        throw new Error("Demande d'ami introuvable");
      }

      const { error: requestError } = await friendRequestsAdapter.acceptFriendRequest(request.id);

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

      // Obtenir l'ID de la demande
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
      
      if (!pendingRequests || pendingRequests.length === 0) {
        throw new Error("Demande d'ami introuvable");
      }
      
      const request = pendingRequests.find(req => 
        req.sender_id === senderId && req.receiver_id === user.id);
      
      if (!request) {
        throw new Error("Demande d'ami introuvable");
      }

      const { error: requestError } = await friendRequestsAdapter.deleteFriendRequest(request.id);

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
