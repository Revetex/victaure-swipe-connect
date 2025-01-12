import { motion } from "framer-motion";
import { VCardEditingActions } from "./actions/VCardEditingActions";
import { VCardViewingActions } from "./actions/VCardViewingActions";
import { StyleOption } from "./types";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  onShare?: () => void;
  onSave: () => void;
  onApplyChanges?: () => void;
  setIsEditing: (isEditing: boolean) => void;
  selectedStyle: StyleOption;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  isProcessing,
  onShare,
  onSave,
  onApplyChanges,
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
          onApplyChanges={onApplyChanges}
          isProcessing={isProcessing}
        />
      ) : (
        <VCardViewingActions
          onShare={onShare}
          onEdit={() => setIsEditing(true)}
          isPdfGenerating={isPdfGenerating}
        />
      )}
    </motion.div>
  );
}