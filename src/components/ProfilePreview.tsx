import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, UserPlus, UserMinus, UserX, Loader2, Clock } from "lucide-react";
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
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');

  useEffect(() => {
    checkConnectionStatus();
  }, [profile.id]);

  const checkConnectionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (requests && requests.length > 0) {
        const request = requests[0];
        if (request.status === 'accepted') {
          setConnectionStatus('connected');
        } else if (request.status === 'pending') {
          setConnectionStatus('pending');
        }
      } else {
        setConnectionStatus('none');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      setIsProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour faire cette action");
        return;
      }

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Demande d'ami envoyée");
      setConnectionStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRequest = async () => {
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

      toast.success("Demande annulée");
      setConnectionStatus('none');
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error("Erreur lors de l'annulation de la demande");
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
      setConnectionStatus('none');
      onClose();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connection");
    } finally {
      setIsProcessing(false);
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

      // First remove any existing friend connection
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
      setConnectionStatus('none');
      onClose();
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error("Erreur lors du blocage de l'utilisateur");
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
            {connectionStatus === 'none' && (
              <Button 
                onClick={handleSendFriendRequest}
                className="w-full"
                variant="default"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter en ami
                  </>
                )}
              </Button>
            )}

            {connectionStatus === 'pending' && (
              <Button
                onClick={handleCancelRequest}
                className="w-full"
                variant="outline"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Annuler la demande
                  </>
                )}
              </Button>
            )}

            {connectionStatus === 'connected' && (
              <Button
                onClick={handleRemoveFriend}
                className="w-full"
                variant="outline"
                disabled={isProcessing}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Retirer la connection
              </Button>
            )}

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