import { Button } from "@/components/ui/button";
import { Share2, Copy, Save, Edit } from "lucide-react";
import { motion } from "framer-motion";

interface VCardActionsProps {
  isEditing: boolean;
  isProcessing?: boolean;
  onShare?: () => void;
  onCopyLink?: () => void;
  onSave?: () => void;
  onApplyChanges?: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
  isProcessing = false,
  onShare,
  onCopyLink,
  onSave,
  onApplyChanges,
  setIsEditing
}: VCardActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-white/10"
    >
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <Button
            onClick={onSave}
            disabled={isProcessing}
            className="w-full h-8 sm:h-10 transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Sauvegarder"
          >
            <Save className="h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <>
          {onShare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <Button
                onClick={onShare}
                className="w-full h-8 sm:h-10 transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
              title="Mode édition"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </motion.div>

          {onCopyLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={onCopyLink}
                variant="outline"
                className="h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
                title="Copier le lien"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}