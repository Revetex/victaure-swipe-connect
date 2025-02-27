
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { motion } from "framer-motion";
import { ProfilePreviewButtons } from "./ProfilePreviewButtons";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onViewProfile?: () => void;
  canViewFullProfile?: boolean;
  className?: string;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onViewProfile,
  canViewFullProfile = true,
  className,
}: ProfilePreviewCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={cn("perspective-1000", className)}>
      <motion.div
        className={cn(
          "relative w-full",
          "transition-all duration-500",
          "preserve-3d",
          "hover:shadow-lg",
          "border rounded-xl",
          "h-[420px] md:h-[400px]"
        )}
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front face */}
        <ProfilePreviewFront
          profile={profile}
          onRequestChat={onRequestChat}
          onFlip={handleFlip}
          canViewFullProfile={canViewFullProfile}
          onViewProfile={onViewProfile}
        />

        {/* Back face */}
        <ProfilePreviewBack 
          profile={profile} 
          onFlip={handleFlip} 
          canViewFullProfile={canViewFullProfile}
        />
      </motion.div>

      {/* Action buttons */}
      <div className="mt-4">
        <ProfilePreviewButtons
          profileId={profile.id}
          onMessage={onRequestChat}
        />
      </div>
    </div>
  );
}
