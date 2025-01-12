import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVCardStyle } from "./VCardStyleContext";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  className?: string;
}

export function VCardContainer({ children, isEditing, className }: VCardContainerProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "relative w-full min-h-screen pb-24 transition-all duration-300",
        isEditing && "bg-background/95 backdrop-blur-sm",
        className
      )}
      style={{
        background: `${selectedStyle.colors.primary}05`,
        color: selectedStyle.colors.text.primary,
        fontFamily: selectedStyle.font
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.div>
  );
}