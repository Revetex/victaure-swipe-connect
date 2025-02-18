
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
}

export function VCardContainer({ children, isEditing }: VCardContainerProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full transition-all duration-300"
      style={{
        fontFamily: selectedStyle.font,
        background: `linear-gradient(to bottom right, ${selectedStyle.colors.background.card}, ${selectedStyle.colors.background.section})`,
      }}
    >
      <div className="relative w-full max-w-3xl mx-auto py-2 px-3 sm:py-6 sm:px-6 lg:py-8">
        <div className={`w-full ${
          isEditing 
            ? 'p-3 sm:p-6 shadow-lg border border-border/20 rounded-xl dark:bg-black/20 dark:border-white/5' 
            : ''
        }`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
