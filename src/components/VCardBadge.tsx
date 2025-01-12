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
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors border shadow-sm"
      style={{
        backgroundColor: variant === 'outline' ? 'transparent' : `${selectedStyle.colors.primary}15`,
        borderColor: `${selectedStyle.colors.primary}30`,
        color: selectedStyle.colors.text.primary
      }}
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-full transition-colors hover:bg-opacity-20"
          style={{
            backgroundColor: 'transparent',
            color: selectedStyle.colors.text.primary
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}