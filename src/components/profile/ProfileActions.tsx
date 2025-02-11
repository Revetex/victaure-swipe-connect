
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
    <div className="fixed bottom-0 left-0 right-0 p-4 flex flex-col w-full gap-2 z-[9999]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm" />
      
      <Button 
        variant={areFriends ? "default" : "secondary"}
        className="relative w-full bg-background/90 hover:bg-background/95 backdrop-blur-sm transition-all duration-200 shadow-lg"
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
          className="relative w-full bg-background/90 hover:bg-background/95 backdrop-blur-sm transition-all duration-200 shadow-lg"
          onClick={handleSendFriendRequest}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter en ami
        </Button>
      )}
      
      <Button
        variant="ghost"
        className="relative w-full bg-background/90 hover:bg-background/95 backdrop-blur-sm transition-all duration-200 shadow-lg"
        onClick={onClose}
      >
        Fermer
      </Button>
    </div>
  );
}
