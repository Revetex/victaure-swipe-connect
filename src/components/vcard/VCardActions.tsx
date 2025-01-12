import { motion } from "framer-motion";
import { VCardEditingActions } from "./actions/VCardEditingActions";
import { VCardViewingActions } from "./actions/VCardViewingActions";
import { StyleOption } from "./types";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  onShare?: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onSave: () => void;
  onCancel: () => void;
  setIsEditing: (isEditing: boolean) => void;
  selectedStyle: StyleOption;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  isProcessing,
  onShare,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onSave,
  onCancel,
  setIsEditing,
  selectedStyle,
}: VCardActionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 pt-4 border-t"
      style={{ borderColor: `${selectedStyle.colors.primary}20` }}
    >
      {isEditing ? (
        <VCardEditingActions
          onSave={onSave}
          onCancel={onCancel}
          isProcessing={isProcessing}
        />
      ) : (
        <VCardViewingActions
          onShare={onShare}
          onEdit={() => setIsEditing(true)}
          onDownloadBusinessPDF={onDownloadBusinessPDF}
          onDownloadCVPDF={onDownloadCVPDF}
          isPdfGenerating={isPdfGenerating}
        />
      )}
    </motion.div>
  );
}