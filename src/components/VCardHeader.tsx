import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { VCardActions } from "./VCardActions";
import { VCardAvatar } from "./vcard/header/VCardAvatar";
import { VCardInfo } from "./vcard/header/VCardInfo";
import { VCardQR } from "./vcard/header/VCardQR";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  isPdfGenerating?: boolean;
  isProcessing?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardHeader({ 
  profile, 
  isEditing, 
  setProfile,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
}: VCardHeaderProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    if (onSave) {
      if (isAvatarDeleted) {
        setProfile({ ...profile, avatar_url: null });
      }
      await onSave();
      setIsAvatarDeleted(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <VCardAvatar 
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          setIsAvatarDeleted={setIsAvatarDeleted}
        />

        <div className="flex-1 min-w-0">
          <VCardInfo 
            profile={profile}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
          />
        </div>

        <div className="flex items-center gap-4">
          {!isEditing && <VCardQR isQRDialogOpen={isQRDialogOpen} setIsQRDialogOpen={setIsQRDialogOpen} profileId={profile.id} />}
          
          <div className="shrink-0">
            <VCardActions
              isEditing={isEditing}
              isProcessing={isProcessing}
              setIsEditing={onEditToggle}
              onSave={handleSave}
              onDownloadBusinessCard={onDownloadBusinessCard}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}