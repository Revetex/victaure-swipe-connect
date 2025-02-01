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
      className="relative w-full min-h-screen transition-all duration-300 text-foreground text-sm sm:text-base bg-transparent px-0"
      style={{
        fontFamily: customStyles?.font || 'inherit',
        backgroundColor: 'transparent',
        color: customStyles?.textColor || 'inherit'
      }}
    >
      <div className="relative z-10 w-full mx-auto py-4 sm:py-6 lg:py-8">
        <div className={`space-y-4 sm:space-y-6 ${
          isEditing 
            ? 'backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-border/20 rounded-xl dark:bg-black/20 dark:border-white/5' 
            : ''
        }`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}