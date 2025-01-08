import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StyleOption } from "./types";
import { motion } from "framer-motion";
import { pdfColors } from "@/utils/pdf/colors";

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
  const textColor = customStyles?.textColor || selectedStyle.colors.text.primary || pdfColors.text.primary;
  const backgroundColor = customStyles?.background || selectedStyle.colors.background.card || pdfColors.background;

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
        background: backgroundColor,
        color: textColor,
        "--text-color": textColor,
        "--bg-color": backgroundColor,
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </motion.div>
  );
}