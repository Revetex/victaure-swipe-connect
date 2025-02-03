import { UserProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileBio } from "./profile/ProfileBio";
import { ProfileSkills } from "./profile/ProfileSkills";
import { ProfileActions } from "./profile/ProfileActions";
import { toast } from "sonner";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
  onViewProfile: () => void;
}

export function ProfilePreview({ profile, onClose, onViewProfile }: ProfilePreviewProps) {
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [areFriends, setAreFriends] = useState(false);

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

  const handleViewProfile = () => {
    if (!areFriends) {
      toast.error("Vous devez être amis pour voir le profil complet");
      return;
    }
    onViewProfile();
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
          
          {/* Informations limitées si pas amis */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold tracking-tight">
              {profile.full_name || "Utilisateur"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {profile.role || "Professionnel"}
            </p>
          </div>

          {/* Bio courte si disponible */}
          {profile.bio && (
            <p className="text-sm text-center text-muted-foreground/90 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Quelques compétences si disponibles */}
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

          <ProfileActions 
            profileId={profile.id}
            isFriendRequestSent={isFriendRequestSent}
            onClose={onClose}
            onFriendRequestChange={setIsFriendRequestSent}
            onViewProfile={handleViewProfile}
            areFriends={areFriends}
          />
        </div>
      </motion.div>
    </div>
  );
}