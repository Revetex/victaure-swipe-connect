import { Button } from "@/components/ui/button";
import { Share2, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownloadBusinessPDF: () => void;
  onDownloadCVPDF: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function VCardActions({
  isEditing,
  onShare,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onSave,
  onApplyChanges,
  setIsEditing,
}: VCardActionsProps) {
  const { selectedStyle } = useVCardStyle();

  // Couleurs spécifiques pour le mode édition
  const editModeColors = {
    primary: "#9b87f5", // Purple primary
    secondary: "#7E69AB", // Purple secondary
    text: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.2)"
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-3 pt-4 border-t"
      style={{ 
        borderColor: isEditing ? editModeColors.border : `${selectedStyle.colors.primary}20`,
        background: isEditing ? "rgba(26, 31, 44, 0.8)" : "transparent", // Dark background in edit mode
        padding: isEditing ? "1rem" : undefined,
        borderRadius: isEditing ? "0.5rem" : undefined,
      }}
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
              className="w-full transition-colors hover:bg-opacity-90"
              style={{ 
                backgroundColor: editModeColors.primary,
                color: editModeColors.text,
                borderColor: editModeColors.border
              }}
            >
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
              className="w-full transition-colors hover:bg-white/10"
              style={{ 
                borderColor: editModeColors.border,
                color: editModeColors.text,
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
        </>
      )}
    </motion.div>
  );
}