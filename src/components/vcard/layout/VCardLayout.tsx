import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useVCardStyle } from "../VCardStyleContext";

interface VCardLayoutProps {
  children: ReactNode;
  isEditing: boolean;
}

export function VCardLayout({ children, isEditing }: VCardLayoutProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full transition-all duration-300"
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isEditing ? 'pb-32' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}