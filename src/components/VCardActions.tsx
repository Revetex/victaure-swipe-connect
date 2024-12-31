import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Save, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";

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
      className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-victaure-gray-light dark:border-victaure-gray-dark"
    >
      {isEditing ? (
        <>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onSave} 
              className="w-full bg-victaure-orange hover:bg-victaure-orange-dark text-white font-medium shadow-md transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[120px]">
            <Button 
              onClick={onApplyChanges} 
              variant="secondary" 
              className="w-full bg-victaure-gray-light hover:bg-victaure-gray text-victaure-dark font-medium shadow-md transition-colors"
            >
              Appliquer
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div variants={item} className="flex-1 min-w-[100px]">
            <Button 
              onClick={onShare} 
              className="w-full bg-victaure-orange hover:bg-victaure-orange-dark text-white font-medium shadow-md transition-colors"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[100px]">
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="outline" 
              className="w-full border-victaure-blue/30 hover:border-victaure-blue hover:bg-victaure-blue/10 text-victaure-blue-dark font-medium shadow-md transition-colors"
            >
              <Edit className="mr-2 h-4 w-4" />
              Mode édition
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[100px]">
            <Button 
              onClick={onDownload} 
              variant="outline" 
              className="w-full border-victaure-blue/30 hover:border-victaure-blue hover:bg-victaure-blue/10 text-victaure-blue-dark font-medium shadow-md transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[100px]">
            <Button 
              onClick={onDownloadBusinessPDF} 
              variant="outline" 
              className="w-full border-victaure-blue/30 hover:border-victaure-blue hover:bg-victaure-blue/10 text-victaure-blue-dark font-medium shadow-md transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              Business PDF
            </Button>
          </motion.div>
          <motion.div variants={item} className="flex-1 min-w-[100px]">
            <Button 
              onClick={onDownloadCVPDF} 
              variant="outline" 
              className="w-full border-victaure-blue/30 hover:border-victaure-blue hover:bg-victaure-blue/10 text-victaure-blue-dark font-medium shadow-md transition-colors"
            >
              <FileText className="mr-2 h-4 w-4" />
              CV PDF
            </Button>
          </motion.div>
          <motion.div variants={item}>
            <Button 
              onClick={onCopyLink} 
              variant="outline"
              className="border-victaure-blue/30 hover:border-victaure-blue hover:bg-victaure-blue/10 text-victaure-blue-dark font-medium shadow-md transition-colors"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}