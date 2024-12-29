import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface VCardActionsProps {
  isEditing: boolean;
  onShare: () => void;
  onDownload: () => void;
  onDownloadPDF: () => void;
  onCopyLink: () => void;
  onSave: () => void;
  onApplyChanges: () => void;
}

export function VCardActions({
  isEditing,
  onShare,
  onDownload,
  onDownloadPDF,
  onCopyLink,
  onSave,
  onApplyChanges,
}: VCardActionsProps) {
  return (
    <motion.div 
      className="flex gap-3 pt-4 border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      {isEditing ? (
        <>
          <Button 
            onClick={onSave} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
          <Button 
            onClick={onApplyChanges} 
            variant="secondary" 
            className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
          >
            Appliquer les changements
          </Button>
        </>
      ) : (
        <>
          <Button 
            onClick={onShare} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button 
            onClick={onDownload} 
            variant="outline" 
            className="flex-1 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            VCard
          </Button>
          <Button 
            onClick={onDownloadPDF} 
            variant="outline" 
            className="flex-1 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button 
            onClick={onCopyLink} 
            variant="outline"
            className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </>
      )}
    </motion.div>
  );
}