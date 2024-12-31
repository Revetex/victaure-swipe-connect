import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2 sm:gap-3"
    >
      {isEditing ? (
        <>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onSave} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onApplyChanges} 
              variant="secondary" 
              className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
            >
              Appliquer
            </Button>
          </motion.div>
        </>
      ) : null}
    </motion.div>
  );
}