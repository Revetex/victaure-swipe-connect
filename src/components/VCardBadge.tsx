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
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors"
      style={{
        backgroundColor: variant === 'outline' ? 'transparent' : `${selectedStyle.colors.primary}08`,
        border: `1px solid ${selectedStyle.colors.primary}15`,
        color: selectedStyle.colors.text.primary,
        boxShadow: `0 1px 2px ${selectedStyle.colors.primary}05`,
        fontFamily: selectedStyle.font,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span 
        className="text-sm font-medium" 
        style={{ 
          color: selectedStyle.colors.text.primary,
          opacity: 0.9,
          textShadow: '0 0.5px 0.5px rgba(0,0,0,0.05)',
          fontFamily: selectedStyle.font
        }}
      >
        {text}
      </span>
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-full hover:bg-black/5 transition-colors"
          style={{
            color: selectedStyle.colors.text.primary
          }}
        >
          <X className="h-3 w-3 opacity-50 hover:opacity-100" />
        </button>
      )}
    </motion.div>
  );
}