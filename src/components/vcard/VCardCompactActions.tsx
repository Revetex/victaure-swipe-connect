import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown, Download } from "lucide-react";
import { motion } from "framer-motion";

export interface VCardCompactActionsProps {
  onExpand: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

export function VCardCompactActions({ onExpand, onEdit, onDownload }: VCardCompactActionsProps) {
  return (
    <motion.div 
      className="flex justify-center gap-2 mt-2 px-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
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
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        className="flex-1 bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
    </motion.div>
  );
}