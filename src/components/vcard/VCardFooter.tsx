import { VCardActions } from "./VCardActions";
import { StyleOption } from "./types";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDownloadBusinessCard: () => Promise<void>;
  onDownloadCV: () => Promise<void>;
}

export function VCardFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  selectedStyle,
  onEditToggle,
  onCancel,
  onSave,
  onDownloadBusinessCard,
  onDownloadCV,
}: VCardFooterProps) {
  return (
    <div className="flex justify-end items-center">
      <VCardActions
        isEditing={isEditing}
        isPdfGenerating={isPdfGenerating}
        isProcessing={isProcessing}
        setIsEditing={onEditToggle}
        onCancel={onCancel}
        onSave={onSave}
        onDownloadBusinessPDF={onDownloadBusinessCard}
        onDownloadCVPDF={onDownloadCV}
        selectedStyle={selectedStyle}
      />
    </div>
  );
}