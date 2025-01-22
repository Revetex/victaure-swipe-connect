import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VCardContainerProps {
  children: ReactNode;
  isEditing?: boolean;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
  isCVView?: boolean;
}

export function VCardContainer({ 
  children, 
  isEditing,
  customStyles,
  isCVView
}: VCardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative w-full rounded-lg shadow-lg overflow-hidden",
        isEditing ? "min-h-[calc(100vh-8rem)]" : "min-h-[calc(100vh-16rem)]",
        isCVView ? "max-w-4xl mx-auto bg-white p-8" : "bg-background/95 backdrop-blur-sm p-6"
      )}
      style={{
        fontFamily: customStyles?.font || 'inherit',
        background: customStyles?.background || undefined,
        color: customStyles?.textColor || undefined
      }}
    >
      {children}
    </motion.div>
  );
}