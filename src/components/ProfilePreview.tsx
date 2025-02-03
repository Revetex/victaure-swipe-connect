import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, UserPlus, UserMinus, UserX } from "lucide-react";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePreview({ profile, isOpen, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestCV = async () => {
    try {
      setIsRequesting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire cette action");
        return;
      }

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          title: 'Demande de CV',
          message: `${user.email} souhaite accéder à votre CV complet. ID:${user.id}`,
        });

      if (notifError) throw notifError;

      toast.success("Demande envoyée avec succès");
      onClose();
    } catch (error) {
      console.error('Error requesting CV:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBlockUser = async () => {
    try {
      setIsProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire cette action");
        return;
      }

      // First remove from friends if they are friends
      await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      // Then add to blocked users
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: profile.id
        });

      if (error) throw error;

      toast.success(`${profile.full_name} a été bloqué`);
      onClose();
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error("Erreur lors du blocage de l'utilisateur");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setIsProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire cette action");
        return;
      }

      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (error) throw error;

      toast.success(`${profile.full_name} a été retiré de vos connections`);
      onClose();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connection");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-4 overflow-y-auto max-h-[90vh]">
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        <div className="flex flex-col items-center gap-4">
          <ProfileAvatar profile={profile} />
          <ProfileInfo profile={profile} />
          
          <div className="w-full space-y-4">
            <div className="text-sm text-muted-foreground">
              {profile.bio || "No bio available"}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button 
              onClick={handleRequestCV}
              className="w-full"
              variant="default"
              disabled={isRequesting || isProcessing}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isRequesting ? "Envoi..." : "Demander le CV"}
            </Button>

            <Button
              onClick={handleRemoveFriend}
              className="w-full"
              variant="outline"
              disabled={isProcessing}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Retirer la connection
            </Button>

            <Button
              onClick={handleBlockUser}
              className="w-full"
              variant="outline"
              disabled={isProcessing}
            >
              <UserX className="mr-2 h-4 w-4" />
              Bloquer
            </Button>

            <Button 
              onClick={onClose}
              className="w-full"
              variant="ghost"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}