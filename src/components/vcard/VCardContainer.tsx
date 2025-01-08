import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StyleOption } from "./types";
import { motion } from "framer-motion";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  customStyles?: {
    font?: string | null;
    background?: string | null;
    textColor?: string | null;
  };
  selectedStyle: StyleOption;
}

export function VCardContainer({ 
  children, 
  isEditing,
  customStyles,
  selectedStyle 
}: VCardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "min-h-screen w-full transition-all duration-300",
        isEditing ? "bg-muted/50 backdrop-blur-sm" : "bg-background",
        selectedStyle.bgGradient
      )}
      style={{
        fontFamily: customStyles?.font || selectedStyle.font,
        background: customStyles?.background || undefined,
        color: customStyles?.textColor || undefined
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </motion.div>
  );
}