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

          {onApplyChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <Button
                onClick={onApplyChanges}
                variant="outline"
                className="w-full h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
                title="Appliquer"
              >
                <FileText className="h-4 w-4" />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <Button
              onClick={onDownloadBusinessPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
              title="Business PDF"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <Button
              onClick={onDownloadCVPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full h-8 sm:h-10 transition-colors border-primary/20 hover:border-primary/30 text-primary hover:text-primary/90"
              title="CV PDF"
            >
              <FileText className="h-4 w-4" />
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