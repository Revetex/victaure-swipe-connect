import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit, Pencil } from "lucide-react";
import { motion } from "framer-motion";
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
        <div className="flex flex-wrap gap-3 w-full">
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex-1 min-w-[120px] transition-colors"
            style={{ 
              borderColor: `${selectedStyle.colors.primary}40`,
              color: selectedStyle.colors.text.primary,
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button 
            onClick={onDownload}
            variant="outline"
            className="flex-1 min-w-[120px] transition-colors"
            style={{ 
              borderColor: `${selectedStyle.colors.primary}40`,
              color: selectedStyle.colors.text.primary,
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Carte
          </Button>
          <Button 
            onClick={onDownloadCVPDF}
            variant="outline"
            className="flex-1 min-w-[120px] transition-colors"
            style={{ 
              borderColor: `${selectedStyle.colors.primary}40`,
              color: selectedStyle.colors.text.primary,
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            CV
          </Button>
          <Button 
            onClick={onShare}
            variant="outline"
            className="flex-1 min-w-[120px] transition-colors"
            style={{ 
              borderColor: `${selectedStyle.colors.primary}40`,
              color: selectedStyle.colors.text.primary,
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      )}
    </motion.div>
  );
}