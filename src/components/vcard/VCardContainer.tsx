
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-h-[calc(100vh-4rem)]",
        "w-full",
        "pt-0 pb-6",
        "px-4 sm:px-6 lg:px-8",
        "bg-[#1C1C1C]",
        "backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "max-w-7xl",
        "bg-[#2C2C2C]/50",
        "rounded-xl shadow-xl",
        "border border-[#3C3C3C]/20",
        "overflow-hidden",
        className
      )}>
        {/* Overlay de fond avec motifs */}
        <div className="absolute inset-0">
          {/* Effet de grille */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(60,60,60,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(60,60,60,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
          
          {/* Dégradé de fond */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C]/30 to-[#1C1C1C]/30 backdrop-blur-md" />
          
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#64B5D9]/5 to-transparent rounded-full -translate-y-32 translate-x-32 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#64B5D9]/5 to-transparent rounded-full translate-y-32 -translate-x-32 blur-2xl" />
        </div>

        {/* Lignes de séparation */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3C3C3C]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#3C3C3C]/20 to-transparent" />
        
        {/* Contenu */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
