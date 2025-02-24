
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import "@/styles/shared.css";

interface VCardContainerProps {
  children: ReactNode;
  className?: string;
  isEditing?: boolean;
}

export function VCardContainer({ children, className, isEditing }: VCardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-h-[calc(100vh-4rem)]",
        "w-full",
        "pt-0", // Supprimé le padding top pour coller au header
        "pb-6",
        "px-4 sm:px-6 lg:px-8",
        "bg-gradient-to-b from-background via-background/95 to-background/90",
        "backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-7xl",
        className
      )}>
        {children}
      </div>
    </motion.div>
  );
}
