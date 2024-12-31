import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, FileText, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export interface VCardCompactActionsProps {
  onExpand: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDownloadPDF: () => void;
  onDownloadBusinessPDF: () => void;
}

export function VCardCompactActions({ 
  onExpand, 
  onEdit,
  onShare,
  onDownloadPDF,
  onDownloadBusinessPDF
}: VCardCompactActionsProps) {
  return (
    <motion.div 
      className="flex flex-col gap-2 mt-4 px-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExpand}
          className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group border-white/20"
        >
          <ChevronDown className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
          Voir plus
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Éditer
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadPDF}
          className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
        >
          <FileText className="h-4 w-4 mr-2" />
          CV PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadBusinessPDF}
          className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
        >
          <FileText className="h-4 w-4 mr-2" />
          Business PDF
        </Button>
      </div>
    </motion.div>
  );
}