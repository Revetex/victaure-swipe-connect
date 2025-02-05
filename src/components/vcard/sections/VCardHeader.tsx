import { UserProfile } from "@/types/profile";
import { ProfileInfo } from "../header/ProfileInfo";
import { ProfileBio } from "../header/ProfileBio";
import { ProfileAvatar } from "../header/ProfileAvatar";
import { VCardActions } from "@/components/VCardActions";
import { useState } from "react";
import { toast } from "sonner";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  onEditToggle: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
}

export function VCardHeader({ 
  profile,
  isEditing,
  setProfile,
  onEditToggle,
  onSave,
  onDownloadBusinessCard
}: VCardHeaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleDownload = async () => {
    if (onDownloadBusinessCard) {
      setIsPdfGenerating(true);
      try {
        await onDownloadBusinessCard();
        toast.success("Carte de visite téléchargée");
      } catch (error) {
        toast.error("Échec du téléchargement");
      } finally {
        setIsPdfGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <ProfileInfo
            profile={profile}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
          />
        </div>
        
        <div className="flex gap-2">
          <VCardActions
            isEditing={isEditing}
            isProcessing={isProcessing}
            isPdfGenerating={isPdfGenerating}
            setIsEditing={onEditToggle}
            onSave={onSave}
            onDownloadBusinessCard={handleDownload}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ProfileAvatar profile={profile} />
        <ProfileBio
          profile={profile}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}