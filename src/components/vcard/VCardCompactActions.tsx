import { Button } from "@/components/ui/button";
import { Download, Edit2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface VCardCompactActionsProps {
  onExpand: () => void;
  onEdit: () => void;
}

export function VCardCompactActions({ onExpand, onEdit }: VCardCompactActionsProps) {
  return (
    <motion.div 
      className="flex justify-end gap-2 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onExpand}
        className="bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 group"
      >
        <ChevronDown className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
        Voir plus
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 backdrop-blur-sm transition-all duration-300"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Éditer
      </Button>
    </motion.div>
  );
}