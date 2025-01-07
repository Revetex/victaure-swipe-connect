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
  
  const getVariantStyles = () => {
    const baseStyles = {
      default: `bg-${selectedStyle.colors.primary}/10 text-${selectedStyle.colors.primary} hover:bg-${selectedStyle.colors.primary}/20 border-${selectedStyle.colors.primary}/20`,
      outline: `bg-transparent border-${selectedStyle.colors.primary}/50 text-${selectedStyle.colors.primary} hover:bg-${selectedStyle.colors.primary}/10`,
      secondary: `bg-${selectedStyle.colors.secondary}/10 text-${selectedStyle.colors.secondary} hover:bg-${selectedStyle.colors.secondary}/20 border-${selectedStyle.colors.secondary}/20`
    };

    return baseStyles[variant];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors border shadow-sm"
      style={{
        backgroundColor: variant === 'outline' ? 'transparent' : `${selectedStyle.color}15`,
        borderColor: `${selectedStyle.color}30`,
        color: selectedStyle.colors.text.primary
      }}
    >
      {text}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-full transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: selectedStyle.colors.text.primary,
            '&:hover': {
              backgroundColor: `${selectedStyle.color}20`
            }
          }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}