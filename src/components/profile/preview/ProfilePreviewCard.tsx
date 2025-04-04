
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose?: () => void;
  canViewFullProfile?: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onClose,
  canViewFullProfile = false,
  onImageClick
}: ProfilePreviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  const handleViewProfile = () => {
    if (!canViewFullProfile && !isOwnProfile && profile.privacy_enabled) {
      toast.error("Ce profil est privé. Connectez-vous avec l'utilisateur pour voir son profil complet.");
      return;
    }
    if (onClose) onClose();
    navigate(`/profile/${profile.id}`);
  };

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    if (onRequestChat) {
      onRequestChat();
    } else {
      if (onClose) onClose();
      navigate(`/messages?receiver=${profile.id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        "bg-black/50 backdrop-blur-sm"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className={cn(
        "relative w-full max-w-md mx-4",
        "bg-zinc-900/95 backdrop-blur-sm",
        "rounded-xl shadow-2xl overflow-hidden",
        "border border-zinc-800"
      )}>
        <div className="p-6">
          {!isFlipped ? (
            <ProfilePreviewFront
              profile={profile}
              onRequestChat={handleMessageClick}
              onFlip={() => setIsFlipped(true)}
              canViewFullProfile={canViewFullProfile || isOwnProfile}
              onClose={onClose}
              onViewProfile={handleViewProfile}
            />
          ) : (
            <ProfilePreviewBack
              profile={profile}
              onFlip={() => setIsFlipped(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
