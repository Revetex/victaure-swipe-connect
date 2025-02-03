import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfileActionsProps {
  profileId: string;
  isFriendRequestSent: boolean;
  onClose: () => void;
  onFriendRequestChange: (value: boolean) => void;
  onViewProfile: () => void;
}

export function ProfileActions({ 
  profileId, 
  isFriendRequestSent, 
  onClose,
  onFriendRequestChange,
  onViewProfile
}: ProfileActionsProps) {
  const handleSendFriendRequest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: user.id,
        receiver_id: profileId,
        status: 'pending'
      });

    if (error) {
      console.error("Error sending friend request:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
      return;
    }

    onFriendRequestChange(true);
    toast.success("Demande d'ami envoyée !");
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Button 
        variant="default"
        className="w-full"
        onClick={onViewProfile}
      >
        Voir le profil complet
      </Button>
      
      {!isFriendRequestSent && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSendFriendRequest}
        >
          Ajouter en ami
        </Button>
      )}
      
      <Button
        variant="ghost"
        className="w-full"
        onClick={onClose}
      >
        Fermer
      </Button>
    </div>
  );
}