import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating?: boolean;  // Added this prop
  isProcessing?: boolean;     // Added this prop
  onShare?: () => void;       // Made optional since it's not always used
  onDownload?: () => void;    // Made optional since it's not always used
  onDownloadPDF?: () => void; // Made optional since it's not always used
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onCopyLink?: () => void;    // Made optional since it's not always used
  onSave: () => void;
  onApplyChanges?: () => void; // Made optional since it's not always used
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
  setIsEditing,
}: VCardActionsProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 pt-4 border-t dark:border-white/10 border-gray-200"
    >
      {isEditing ? (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[120px]"
          >
            <Button 
              onClick={onSave}
              disabled={isProcessing}
              className="w-full transition-colors bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isProcessing ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </motion.div>
          {onApplyChanges && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[120px]"
            >
              <Button 
                onClick={onApplyChanges}
                variant="outline" 
                className="w-full transition-colors border-primary/20 hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 dark:text-white text-primary"
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
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onShare}
                className="w-full transition-colors bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </motion.div>
          )}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full transition-colors border-primary/20 hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 dark:text-white text-primary"
            >
              <Edit className="mr-2 h-4 w-4" />
              Mode édition
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadBusinessPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full transition-colors border-primary/20 hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 dark:text-white text-primary"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isPdfGenerating ? "Génération..." : "Business PDF"}
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadCVPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full transition-colors border-primary/20 hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 dark:text-white text-primary"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isPdfGenerating ? "Génération..." : "CV PDF"}
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
                className="transition-colors border-primary/20 hover:border-primary/30 dark:border-white/10 dark:hover:border-white/20 dark:text-white text-primary"
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