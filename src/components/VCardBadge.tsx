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
      className="relative inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all group"
      style={{
        backgroundColor: `${selectedStyle.colors.primary}08`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${selectedStyle.colors.primary}15`,
        boxShadow: `0 2px 10px ${selectedStyle.colors.primary}10`,
        color: selectedStyle.colors.text.primary,
        fontFamily: selectedStyle.font,
      }}
    >
      <div 
        className="absolute inset-0 rounded-full opacity-10"
        style={{
          background: `linear-gradient(135deg, ${selectedStyle.colors.primary}15, ${selectedStyle.colors.secondary}10)`,
          filter: 'blur(4px)',
        }}
      />
      
      <span 
        className="relative text-sm font-medium z-10" 
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
          className="relative z-10 p-0.5 rounded-full hover:bg-black/5 transition-colors"
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