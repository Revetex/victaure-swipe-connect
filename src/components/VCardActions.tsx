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
      className="flex flex-wrap gap-3"
    >
      {!isEditing && (
        <>
          <motion.div variants={item}>
            <Button 
              onClick={onShare} 
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              onClick={onDownload}
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              VCard
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              onClick={onDownloadPDF}
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              onClick={onCopyLink}
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copier le lien
            </Button>
          </motion.div>
        </>
      )}
      
      {isEditing && (
        <>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onSave} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onApplyChanges} 
              variant="secondary" 
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Appliquer
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}