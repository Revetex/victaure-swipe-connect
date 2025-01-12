import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  className?: string;
}

export function VCardContainer({ children, isEditing, className }: VCardContainerProps) {
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
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.div>
  );
}