import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StyleOption } from "./types";

interface VCardActionsProps {
  isEditing: boolean;
  isPdfGenerating: boolean;
  isProcessing: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onDownloadPDF?: () => void;
  onDownloadBusinessPDF: () => Promise<void>;
  onDownloadCVPDF: () => Promise<void>;
  onCopyLink?: () => void;
  onSave: () => void;
  onApplyChanges?: () => void;
  setIsEditing: (isEditing: boolean) => void;
  selectedStyle: StyleOption;
}

export function VCardActions({
  isEditing,
  isPdfGenerating,
  isProcessing,
  onShare,
  onDownload,
  onDownloadPDF,
  onDownloadBusinessPDF,
  onDownloadCVPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
  setIsEditing,
  selectedStyle,
}: VCardActionsProps) {
  const buttonStyle = {
    backgroundColor: '#3B82F6', // Bleu
    color: 'white',
    borderColor: '#2563EB',
  };

  const outlineButtonStyle = {
    borderColor: '#3B82F6',
    color: '#3B82F6',
  };

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
              disabled={isProcessing}
              className="w-full transition-colors relative"
              style={buttonStyle}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Traitement...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
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
                disabled={isProcessing}
                variant="outline" 
                className="w-full transition-colors"
                style={outlineButtonStyle}
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
                className="w-full transition-colors"
                style={buttonStyle}
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
              className="w-full transition-colors"
              style={outlineButtonStyle}
            >
              <Edit className="mr-2 h-4 w-4" />
              Mode édition
            </Button>
          </motion.div>
          {onDownload && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-[100px]"
            >
              <Button 
                onClick={onDownload}
                variant="outline"
                className="w-full transition-colors"
                style={outlineButtonStyle}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </motion.div>
          )}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-[100px]"
          >
            <Button 
              onClick={onDownloadBusinessPDF}
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full transition-colors"
              style={outlineButtonStyle}
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
              disabled={isPdfGenerating}
              variant="outline"
              className="w-full transition-colors"
              style={outlineButtonStyle}
            >
              <FileText className="mr-2 h-4 w-4" />
              CV PDF
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
                className="transition-colors"
                style={outlineButtonStyle}
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