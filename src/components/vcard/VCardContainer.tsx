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
      className={`relative w-full min-h-screen transition-all duration-300 ${
        isEditing ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900' : 'bg-gradient-to-br from-purple-100 via-white to-purple-50'
      }`}
      style={{
        fontFamily: customStyles?.font || 'inherit',
      }}
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`space-y-6 ${isEditing ? 'pb-32' : ''}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}