import { X } from "lucide-react";
import { motion } from "framer-motion";

interface VCardBadgeProps {
  text: string;
  isEditing?: boolean;
  onRemove?: () => void;
}

export function VCardBadge({ text, isEditing, onRemove }: VCardBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.span>
  );
}