
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import "@/styles/shared.css";

interface VCardContainerProps {
  children: ReactNode;
  className?: string;
  isEditing?: boolean;
}

export function VCardContainer({
  children,
  className,
  isEditing
}: VCardContainerProps) {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 10
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.3
      }} 
      className={cn(
        "min-h-[calc(100vh-4rem)]",
        "w-full",
        "pt-0 pb-6",
        "px-4 sm:px-6",
        "bg-background"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-5xl",
        "rounded-lg shadow-sm",
        "border border-border/30",
        "overflow-hidden",
        className
      )}>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
