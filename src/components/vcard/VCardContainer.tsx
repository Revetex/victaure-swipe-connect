
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
        "bg-gradient-to-b from-[#E6E9F0] via-[#E6E9F0]/95 to-[#F1F0FB]/90",
        "backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-7xl",
        className
      )}>
        <div className="absolute inset-0 bg-[#E6E9F0]/30 dark:bg-[#1A1F2C]/30 backdrop-blur-md" />
        <div className="absolute inset-0">
          {/* Coins colorés avec dégradés plus doux */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#64B5D9]/30 via-[#64B5D9]/20 to-transparent rounded-tl-3xl transform -translate-x-4 -translate-y-4" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#1B2A4A]/30 via-[#1B2A4A]/20 to-transparent rounded-tr-3xl transform translate-x-4 -translate-y-4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#1B2A4A]/30 via-[#1B2A4A]/20 to-transparent rounded-bl-3xl transform -translate-x-4 translate-y-4" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#64B5D9]/30 via-[#64B5D9]/20 to-transparent rounded-br-3xl transform translate-x-4 translate-y-4" />
          
          {/* Motif de points avec opacité réduite */}
          <div 
            className="absolute inset-0 opacity-3"
            style={{
              backgroundImage: 'radial-gradient(circle, #64B5D9 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          
          {/* Ajout d'un motif de grille subtil */}
          <div 
            className="absolute inset-0 opacity-2"
            style={{
              backgroundImage: 'linear-gradient(to right, #64B5D9 1px, transparent 1px), linear-gradient(to bottom, #64B5D9 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>
        {children}
      </div>
    </motion.div>
  );
}
