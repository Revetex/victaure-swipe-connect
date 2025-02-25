
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
        "pt-0",
        "pb-6",
        "px-4 sm:px-6 lg:px-8",
        "bg-gradient-to-b from-[#F1F0FB] via-[#F1F0FB]/95 to-[#F1F0FB]/90",
        "backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-7xl",
        className
      )}>
        <div className="absolute inset-0 bg-[#F1F0FB]/30 dark:bg-[#1A1F2C]/30 backdrop-blur-md" />
        <div className="absolute inset-0">
          {/* Coins colorés */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#64B5D9]/20 via-[#64B5D9]/10 to-transparent rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1B2A4A]/20 via-[#1B2A4A]/10 to-transparent rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1B2A4A]/20 via-[#1B2A4A]/10 to-transparent rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#64B5D9]/20 via-[#64B5D9]/10 to-transparent rounded-br-3xl" />
          
          {/* Motif de points subtil */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #64B5D9 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>
        {children}
      </div>
    </motion.div>
  );
}
