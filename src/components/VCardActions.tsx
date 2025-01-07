import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
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
      className="flex flex-wrap gap-3 pt-4 border-t"
      style={{ borderColor: `${selectedStyle.colors.primary}20` }}
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
              className="w-full transition-colors"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: 'white',
                borderColor: `${selectedStyle.colors.primary}40`
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[120px]"
          >
            <Button 
              onClick={onApplyChanges}
              variant="outline" 
              className="w-full transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
            >
              Appliquer
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onShare}
              className="w-full transition-colors"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: 'white',
                borderColor: `${selectedStyle.colors.primary}40`
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
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
              onClick={onDownload}
              variant="outline"
              className="w-full transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadBusinessPDF}
              variant="outline"
              className="w-full transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Business PDF
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadCVPDF}
              variant="outline"
              className="w-full transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              CV PDF
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button 
              onClick={onCopyLink}
              variant="outline"
              className="transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}40`,
                color: selectedStyle.colors.text.primary,
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}