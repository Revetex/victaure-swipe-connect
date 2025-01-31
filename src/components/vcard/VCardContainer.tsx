import { ReactNode } from "react";
import { motion } from "framer-motion";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  customStyles?: {
    font?: string | null;
    background?: string | null;
    textColor?: string | null;
  };
}

export function VCardContainer({ children, isEditing, customStyles }: VCardContainerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-screen transition-all duration-300 bg-background text-foreground text-sm sm:text-base"
      style={{
        fontFamily: customStyles?.font || 'inherit',
        backgroundColor: customStyles?.background || 'inherit',
        color: customStyles?.textColor || 'inherit'
      }}
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="relative z-10 w-full mx-auto py-4 sm:py-6 lg:py-8">
        <div className={`space-y-4 sm:space-y-6 ${
          isEditing 
            ? 'bg-card/10 p-4 sm:p-6 shadow-lg border border-border/10 rounded-xl backdrop-blur-sm' 
            : ''
        }`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}