import { ReactNode } from "react";
import { motion } from "framer-motion";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardSection({ 
  title, 
  icon, 
  children, 
  className = "",
  customStyles = {} 
}: VCardSectionProps) {
  const { font, background, textColor } = customStyles;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 rounded-lg p-4 ${background || 'bg-transparent'} ${className}`}
      style={{
        fontFamily: font || 'inherit',
        color: textColor || 'inherit'
      }}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}