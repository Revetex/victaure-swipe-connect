import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProfileActionsProps {
  profileId: string;
  isFriendRequestSent: boolean;
  onClose: () => void;
  onFriendRequestChange: (sent: boolean) => void;
}

export function ProfileActions({ 
  profileId, 
  isFriendRequestSent, 
  onClose,
  onFriendRequestChange 
}: ProfileActionsProps) {
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);

      if (checkError) throw checkError;

      let messageId;

      if (!existingMessages || existingMessages.length === 0) {
        const { data: newMessage, error: insertError } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: profileId,
            content: "👋 Bonjour!",
            read: false
          })
          .select()
          .single();

        if (insertError) throw insertError;
        messageId = newMessage.id;
      } else {
        messageId = existingMessages[0].id;
      }

      onClose();
      
      setTimeout(() => {
        navigate(`/dashboard/messages/${profileId}`);
        toast.success("Conversation créée avec succès");
      }, 0);

    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  const handleFriendRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);

      if (existingRequests && existingRequests.length > 0) {
        const request = existingRequests[0];
        if (request.sender_id === user.id) {
          const { error: deleteError } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', request.id);

          if (deleteError) throw deleteError;
          toast.success("Demande d'ami annulée");
          onFriendRequestChange(false);
        } else {
          toast.info("Cette personne vous a déjà envoyé une demande d'ami");
        }
        return;
      }

      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profileId,
          status: 'pending'
        });

      if (requestError) throw requestError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: profileId,
          title: "Nouvelle demande d'ami",
          message: `${user.email} souhaite vous ajouter comme ami`,
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
        toast.error("Impossible d'envoyer la notification");
      } else {
        toast.success("Demande d'ami envoyée");
        onFriendRequestChange(true);
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <Button 
        className={`flex-1 ${isFriendRequestSent ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
        onClick={handleFriendRequest}
      >
        {isFriendRequestSent ? (
          <>
            <UserMinus className="h-4 w-4 mr-2" />
            Annuler
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
          </>
        )}
      </Button>
      <Button 
        className="flex-1"
        variant="outline"
        onClick={handleSendMessage}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Message
      </Button>
    </div>
  );
}