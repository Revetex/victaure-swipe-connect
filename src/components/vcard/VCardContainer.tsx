
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import "@/styles/shared.css";
import { useThemeContext } from "@/components/ThemeProvider";

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
  const { isDark, themeStyle } = useThemeContext();
  
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
        "bg-background",
        `theme-${themeStyle}`
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-5xl",
        "rounded-lg shadow-sm",
        isDark ? "border border-white/10" : "border border-slate-200/30",
        "overflow-hidden",
        "backdrop-blur-sm",
        className
      )}>
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none z-0" />
      </div>
    </motion.div>
  );
}
