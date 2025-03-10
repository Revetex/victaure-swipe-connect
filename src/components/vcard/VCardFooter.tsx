import { VCardActions } from "../VCardActions";
import { StyleOption } from "./types";

interface VCardFooterProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  selectedStyle: StyleOption;
  onEditToggle: () => void;
  onSave: () => void;
  onDownloadCV: () => Promise<void>;
}

export function VCardFooter({
  isEditing,
  isPdfGenerating,
  isProcessing,
  onEditToggle,
  onSave,
  onDownloadCV,
}: VCardFooterProps) {
  return (
    <div className="flex justify-start items-center w-full">
      <VCardActions
        isEditing={isEditing}
        isPdfGenerating={isPdfGenerating}
        isProcessing={isProcessing}
        setIsEditing={(value) => {
          onEditToggle();
        }}
        onSave={onSave}
      />
    </div>
  );
}