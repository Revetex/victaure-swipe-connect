import { UserProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { Button } from "./ui/button";
import { UserPlus, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
}

export function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [areFriends, setAreFriends] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRelationship = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (friendRequests && friendRequests.length > 0) {
        const request = friendRequests[0];
        setIsFriendRequestSent(request.sender_id === user.id && request.status === 'pending');
        setAreFriends(request.status === 'accepted');
      }
    };

    checkRelationship();
  }, [profile.id]);

  const handleSendFriendRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer une demande d'ami");
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

      setIsFriendRequestSent(true);
      toast.success("Demande d'ami envoyée !");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  const handleViewProfile = () => {
    if (!areFriends) {
      toast.error("Vous devez être amis pour voir le profil complet");
      return;
    }
    navigate(`/dashboard/profile/${profile.id}`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card dark:bg-card/95 rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center space-y-4">
          <ProfileAvatar profile={profile} />
          
          <div className="text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              {profile.full_name || "Utilisateur"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {profile.role || "Professionnel"}
            </p>
          </div>

          {profile.bio && (
            <p className="text-sm text-center text-muted-foreground/90 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 w-full">
            {!areFriends && !isFriendRequestSent ? (
              <Button 
                className="w-full"
                onClick={handleSendFriendRequest}
                variant="default"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            ) : isFriendRequestSent ? (
              <Button 
                className="w-full"
                variant="secondary"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Demande envoyée
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleViewProfile}
                variant="default"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir le profil
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}