import { Button } from "@/components/ui/button";
import { Share2, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating?: boolean;
  isProcessing?: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onDownloadPDF?: () => void;
  onDownloadBusinessPDF?: () => Promise<void>;
  onDownloadCVPDF?: () => Promise<void>;
  onCopyLink?: () => void;
  onSave?: () => void;
  onApplyChanges?: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
  isPdfGenerating = false,
  isProcessing = false,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
  setIsEditing
}: VCardActionsProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-white/10"
    >
      {isEditing ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button
              onClick={onSave}
              disabled={isProcessing}
              className="w-full text-xs sm:text-sm transition-colors bg-primary hover:bg-primary/90 text-primary-foreground h-8 sm:h-10"
            >
              <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isProcessing ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </motion.div>

          {onApplyChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button
                onClick={onApplyChanges}
                variant="outline"
                className="w-full text-xs sm:text-sm h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
              >
                Appliquer
              </Button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {onShare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[80px] sm:min-w-[100px]"
            >
              <Button
                onClick={onShare}
                className="w-full text-xs sm:text-sm h-8 sm:h-10 transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Share2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Partager
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[80px] sm:min-w-[100px]"
          >
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full text-xs sm:text-sm h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
            >
              <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Mode édition
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[80px] sm:min-w-[100px]"
          >
            <Button
              onClick={onDownloadBusinessPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full text-xs sm:text-sm h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
            >
              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isPdfGenerating ? "..." : "Business PDF"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[80px] sm:min-w-[100px]"
          >
            <Button
              onClick={onDownloadCVPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full text-xs sm:text-sm h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
            >
              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isPdfGenerating ? "..." : "CV PDF"}
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
                className="h-8 sm:h-10 text-xs sm:text-sm transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}