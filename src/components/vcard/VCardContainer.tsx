
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
        y: 20
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
        "px-4 sm:px-6 lg:px-8",
        "bg-gradient-to-b from-[#F1F0FB] via-[#F7F7FC] to-[#FFFFFF]",
        "dark:from-[#1A1F2C] dark:via-[#1A1F2C]/95 dark:to-[#1A1F2C]/90",
        "backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-7xl",
        "bg-gradient-to-br from-white/50 to-transparent",
        "dark:from-gray-900/50 dark:to-transparent",
        "rounded-xl shadow-xl",
        "border border-white/20 dark:border-gray-800/20",
        "overflow-hidden",
        className
      )}>
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,0,0,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" 
          />
          <div 
            className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-32 -translate-x-32 blur-2xl" 
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-gray-800/20 to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
