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
        isEditing 
          ? "bg-background/95 backdrop-blur-sm" 
          : "bg-gradient-to-br from-background via-background/80 to-background/60",
        !isEditing && selectedStyle.bgGradient
      )}
      style={{
        fontFamily: customStyles?.font || selectedStyle.font,
        color: customStyles?.textColor || selectedStyle.colors.text.primary,
        background: customStyles?.background || undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={cn(
          "rounded-xl transition-all duration-300 overflow-hidden",
          isEditing 
            ? "bg-card/95 backdrop-blur-md shadow-xl border border-border/50" 
            : "bg-transparent"
        )}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}