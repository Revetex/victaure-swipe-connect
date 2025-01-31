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
      className="relative w-full min-h-screen transition-all duration-300 text-foreground dark:text-black text-sm sm:text-base"
      style={{
        fontFamily: customStyles?.font || 'inherit',
        backgroundColor: customStyles?.background || 'transparent',
        color: customStyles?.textColor || 'inherit'
      }}
    >
      <div className="relative z-10 w-full mx-auto py-4 sm:py-6 lg:py-8">
        <div className={`space-y-4 sm:space-y-6 ${
          isEditing 
            ? 'backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-border/20 rounded-xl' 
            : ''
        }`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}