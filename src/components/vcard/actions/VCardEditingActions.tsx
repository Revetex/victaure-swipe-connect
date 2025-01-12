import { VCardActionButton } from "./VCardActionButton";
import { Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface VCardEditingActionsProps {
  onSave: () => void;
  onApplyChanges: () => void;
  isProcessing: boolean;
}

export function VCardEditingActions({
  onSave,
  onApplyChanges,
  isProcessing
}: VCardEditingActionsProps) {
  return (
    <motion.div className="flex flex-wrap gap-3">
      <VCardActionButton
        icon={Save}
        label="Sauvegarder"
        onClick={onSave}
        disabled={isProcessing}
        isProcessing={isProcessing}
      />
      <VCardActionButton
        icon={X}
        label="Annuler"
        onClick={onApplyChanges}
        variant="outline"
        disabled={isProcessing}
      />
    </motion.div>
  );
}