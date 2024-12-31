import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown } from "lucide-react";
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
        className="bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group border-white/20"
      >
        <ChevronDown className="h-4 w-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
        Voir plus
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="bg-white/5 hover:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border-white/20"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Éditer
      </Button>
    </motion.div>
  );
}