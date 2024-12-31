import { X } from "lucide-react";
import { motion } from "framer-motion";

interface VCardBadgeProps {
  text: string;
  isEditing?: boolean;
  onRemove?: () => void;
}

export function VCardBadge({ text, isEditing, onRemove }: VCardBadgeProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-blue-500/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-900/50 transition-colors border border-blue-500/20 dark:border-blue-400/20 shadow-sm"
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-blue-600/20 dark:hover:bg-blue-800/50 rounded-full transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}