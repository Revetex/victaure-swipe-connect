import { UserProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileInfo } from "./profile/ProfileInfo";
import { ProfileBio } from "./profile/ProfileBio";
import { ProfileSkills } from "./profile/ProfileSkills";
import { ProfileActions } from "./profile/ProfileActions";

interface ProfilePreviewProps {
  profile: UserProfile;
  onClose: () => void;
  onViewProfile: () => void;
}

export function ProfilePreview({ profile, onClose, onViewProfile }: ProfilePreviewProps) {
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (existingRequests && existingRequests.length > 0) {
        const request = existingRequests[0];
        setIsFriendRequestSent(request.sender_id === user.id);
      }
    };

    checkExistingRequest();
  }, [profile.id]);

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
          <ProfileInfo profile={profile} />
          <ProfileBio bio={profile.bio} />
          <ProfileSkills skills={profile.skills} />
          <ProfileActions 
            profileId={profile.id}
            isFriendRequestSent={isFriendRequestSent}
            onClose={onClose}
            onFriendRequestChange={setIsFriendRequestSent}
            onViewProfile={onViewProfile}
          />
        </div>
      </motion.div>
    </div>
  );
}