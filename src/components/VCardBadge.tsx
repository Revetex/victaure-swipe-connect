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
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-primary/10 text-primary"
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}