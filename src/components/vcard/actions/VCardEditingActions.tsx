import { VCardActionButton } from "./VCardActionButton";
import { Save, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardEditingActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onApplyChanges?: () => void;
  isProcessing: boolean;
}

export function VCardEditingActions({
  onSave,
  onCancel,
  onApplyChanges,
  isProcessing
}: VCardEditingActionsProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="flex flex-wrap gap-3 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <motion.div 
          className="flex-1 min-w-[100px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <VCardActionButton
            icon={Save}
            label="Sauvegarder"
            onClick={onSave}
            disabled={isProcessing}
            isProcessing={isProcessing}
            className={cn(
              "w-full bg-green-500 hover:bg-green-600 text-white",
              "transition-all duration-300 ease-in-out"
            )}
          />
        </motion.div>

        {onApplyChanges && (
          <motion.div 
            className="flex-1 min-w-[100px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <VCardActionButton
              icon={Check}
              label="Appliquer"
              onClick={onApplyChanges}
              disabled={isProcessing}
              variant="outline"
              className={cn(
                "w-full border-green-500 text-green-500 hover:bg-green-50",
                "transition-all duration-300 ease-in-out"
              )}
            />
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <VCardActionButton
            icon={X}
            label="Annuler"
            onClick={onCancel}
            disabled={isProcessing}
            variant="outline"
            className={cn(
              "border-red-500 text-red-500 hover:bg-red-50",
              "transition-all duration-300 ease-in-out"
            )}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}