
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Ban } from "lucide-react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { ProfilePreviewHeader } from "./ProfilePreviewHeader";
import { ProfilePreviewSkills } from "./ProfilePreviewSkills";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onFlip: () => void;
}

export function ProfilePreviewFront({
  profile,
  onFlip,
}: ProfilePreviewFrontProps) {
  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
  } = useConnectionActions(profile.id);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="space-y-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden p-4"
      >
        <ProfilePreviewHeader profile={profile} />
        <ProfilePreviewSkills profile={profile} />
      </motion.div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {isFriend ? (
            <Button
              variant="destructive"
              className="flex items-center gap-2 col-span-2"
              onClick={handleRemoveFriend}
            >
              <UserMinus className="h-4 w-4" />
              Supprimer
            </Button>
          ) : isFriendRequestReceived ? (
            <Button
              variant="default"
              className="flex items-center gap-2 col-span-2"
              onClick={handleAcceptFriend}
            >
              <UserPlus className="h-4 w-4" />
              Accepter la demande
            </Button>
          ) : !isFriendRequestSent ? (
            <Button
              variant="default"
              className="flex items-center gap-2 col-span-2"
              onClick={handleAddFriend}
            >
              <UserPlus className="h-4 w-4" />
              Se connecter
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="flex items-center gap-2 col-span-2"
              disabled
            >
              Demande envoyée
            </Button>
          )}
        </div>

        <Button
          variant={isBlocked ? "destructive" : "outline"}
          onClick={handleToggleBlock}
          className="flex items-center gap-2"
        >
          <Ban className="h-4 w-4" />
          {isBlocked ? "Débloquer" : "Bloquer"}
        </Button>
      </div>
    </div>
  );
}
