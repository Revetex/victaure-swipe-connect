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
import { FileText, UserPlus, UserMinus, UserX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

      await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ProfileAvatar profile={profile} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileInfo profile={profile} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              {profile.bio || "No bio available"}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <motion.span 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2 w-full"
          >
            <Button 
              onClick={handleRequestCV}
              className="w-full relative"
              variant="default"
              disabled={isRequesting || isProcessing}
            >
              {isRequesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Demander le CV
                </>
              )}
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
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}