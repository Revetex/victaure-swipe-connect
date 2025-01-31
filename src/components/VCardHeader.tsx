import { UserProfile } from "@/types/profile";
import { VCardActions } from "./VCardActions";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  isPdfGenerating?: boolean;
  isProcessing?: boolean;
  onEditToggle?: () => void;
  onSave?: () => void;
  onDownloadBusinessCard?: () => Promise<void>;
  onDownloadCV?: () => Promise<void>;
}

export function VCardHeader({
  profile,
  isEditing,
  setProfile,
  isPdfGenerating,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV
}: VCardHeaderProps) {
  return (
    <div className="px-4 py-2">
      <VCardActions
        isEditing={isEditing}
        isPdfGenerating={isPdfGenerating}
        isProcessing={isProcessing}
        onShare={() => {}}
        onDownload={() => {}}
        onDownloadPDF={() => {}}
        onDownloadBusinessPDF={onDownloadBusinessCard}
        onDownloadCVPDF={onDownloadCV}
        onCopyLink={() => {}}
        onSave={onSave}
        onApplyChanges={() => {}}
        setIsEditing={onEditToggle}
      />
    </div>
  );
}