
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { FileText, UserPlus, UserMinus, Ban, MessageCircle } from "lucide-react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { ProfilePreviewHeader } from "./ProfilePreviewHeader";
import { ProfilePreviewContact } from "./ProfilePreviewContact";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onFlip: () => void;
}

export function ProfilePreviewFront({
  profile,
  onRequestChat,
  onFlip,
}: ProfilePreviewFrontProps) {
  const navigate = useNavigate();
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

  const handleViewFullProfile = () => {
    navigate(`/profile/${profile.id}`);
  };

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
    <div className="space-y-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative p-6">
          <ProfilePreviewHeader profile={profile} />
          
          {isFriend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6 border-t border-gray-200/10 pt-6"
            >
              <ProfilePreviewContact profile={profile} />
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {isFriend ? (
            <>
              <Button
                variant="default"
                className="bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-2"
                onClick={handleViewFullProfile}
              >
                <FileText className="h-4 w-4" />
                Voir profil complet
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={handleRemoveFriend}
              >
                <UserMinus className="h-4 w-4" />
                Supprimer
              </Button>
            </>
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

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={isBlocked ? "destructive" : "outline"}
            onClick={handleToggleBlock}
            className="flex items-center gap-2"
          >
            <Ban className="h-4 w-4" />
            {isBlocked ? "Débloquer" : "Bloquer"}
          </Button>

          {isFriend && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onRequestChat}
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-2"
          onClick={onFlip}
        >
          Voir le dos de la carte
        </Button>
      </div>
    </div>
  );
}
