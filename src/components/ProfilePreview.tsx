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
import { FileText } from "lucide-react";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePreview({ profile, isOpen, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestCV = async () => {
    try {
      setIsRequesting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire cette action");
        return;
      }

      // Create notification for the profile owner
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-4">
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

          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleRequestCV}
              className="flex-1"
              variant="default"
              disabled={isRequesting}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isRequesting ? "Envoi..." : "Demander le CV"}
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1"
              variant="outline"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}