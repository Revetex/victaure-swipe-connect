
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

      // Obtenir l'ID de demande d'ami (request_id)
      const { data: requestData, error: requestError } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', senderId)
        .eq('status', 'pending')
        .single();

      if (requestError) throw requestError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Accepter la demande d'ami
      const { error: acceptError } = await supabase.rpc('accept_friend_request', {
        p_request_id: requestData.id,
        p_user_id: user.id
      });

      if (acceptError) throw acceptError;

      onDelete(id);
      toast.success("Demande d'ami acceptée");
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  const handleRejectFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      // Obtenir l'ID de demande d'ami (request_id)
      const { data: requestData, error: requestError } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', senderId)
        .eq('status', 'pending')
        .single();

      if (requestError) throw requestError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Rejeter la demande d'ami
      const { error: rejectError } = await supabase.rpc('reject_friend_request', {
        p_request_id: requestData.id,
        p_user_id: user.id
      });

      if (rejectError) throw rejectError;

      onDelete(id);
      toast.success("Demande d'ami rejetée");
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error("Erreur lors du rejet de la demande");
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
