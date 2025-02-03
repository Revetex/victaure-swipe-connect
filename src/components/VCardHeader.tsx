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

          <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
            {!isEditing && profile.email && (
              <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile.email}
              </span>
            )}
            {!isEditing && profile.phone && (
              <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile.phone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isEditing && <VCardQR isQRDialogOpen={isQRDialogOpen} setIsQRDialogOpen={setIsQRDialogOpen} />}
          
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