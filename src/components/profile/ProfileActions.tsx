import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRound, UserPlus, Eye } from "lucide-react";

interface ProfileActionsProps {
  profileId: string;
  isFriendRequestSent: boolean;
  areFriends: boolean;
  onClose: () => void;
  onFriendRequestChange: (value: boolean) => void;
  onViewProfile: () => void;
}

export function ProfileActions({ 
  profileId, 
  isFriendRequestSent,
  areFriends,
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
        variant={areFriends ? "default" : "secondary"}
        className="w-full"
        onClick={onViewProfile}
      >
        {areFriends ? (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Voir le profil complet
          </>
        ) : (
          <>
            <UserRound className="mr-2 h-4 w-4" />
            Aperçu limité
          </>
        )}
      </Button>
      
      {!isFriendRequestSent && !areFriends && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSendFriendRequest}
        >
          <UserPlus className="mr-2 h-4 w-4" />
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