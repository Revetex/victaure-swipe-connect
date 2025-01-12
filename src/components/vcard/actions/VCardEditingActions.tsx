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
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex flex-wrap gap-3 max-w-4xl mx-auto">
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
                "w-full bg-primary hover:bg-primary/90 text-primary-foreground",
                "shadow-lg hover:shadow-xl transition-all"
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
                  "w-full border-primary text-primary",
                  "hover:bg-primary/10 shadow hover:shadow-lg transition-all"
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
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-background/80"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}