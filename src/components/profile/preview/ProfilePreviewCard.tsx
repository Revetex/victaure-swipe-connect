
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
    <div className={cn(
      "relative w-full max-w-md mx-auto",
      "bg-background/95 backdrop-blur-sm",
      "rounded-xl shadow-xl overflow-hidden",
      "border border-border/50"
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
  );
}
