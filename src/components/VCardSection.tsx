import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  useCustomStyles?: boolean;
}

export function VCardSection({ 
  title, 
  icon, 
  children, 
  className = "",
  useCustomStyles = true 
}: VCardSectionProps) {
  const { selectedStyle } = useVCardStyle();

  const textColor = useCustomStyles ? selectedStyle.colors.text.primary : undefined;
  const primaryColor = useCustomStyles ? selectedStyle.colors.primary : undefined;
  const fontFamily = useCustomStyles ? selectedStyle.font : undefined;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
      style={{ 
        color: textColor,
        fontFamily: fontFamily
      }}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div style={{ color: primaryColor }}>
          {icon}
        </div>
        <h3 
          className="text-lg font-semibold"
          style={{ 
            color: textColor,
            fontFamily: fontFamily
          }}
        >
          {title}
        </h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}