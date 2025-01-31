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
      className="relative w-full min-h-screen transition-all duration-300 text-foreground text-sm sm:text-base bg-transparent"
      style={{
        fontFamily: customStyles?.font || 'inherit',
        backgroundColor: 'transparent',
        color: customStyles?.textColor || 'inherit'
      }}
    >
      <div className="relative z-10 w-full mx-auto">
        <div className={`space-y-4 ${
          isEditing 
            ? 'backdrop-blur-sm shadow-lg border border-border/20 rounded-xl dark:bg-black/20 dark:border-white/5' 
            : ''
        }`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}