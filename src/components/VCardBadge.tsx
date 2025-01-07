import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardBadgeProps {
  text: string;
  isEditing?: boolean;
  onRemove?: () => void;
  variant?: "default" | "outline" | "secondary";
}

export function VCardBadge({ 
  text, 
  isEditing, 
  onRemove,
  variant = "default" 
}: VCardBadgeProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors bg-white/10 border border-white/20 text-white/90 shadow-sm hover:bg-white/20"
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-full transition-colors hover:bg-white/20"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}