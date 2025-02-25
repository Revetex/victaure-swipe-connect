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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className={cn("min-h-[calc(100vh-4rem)]", "w-full", "pt-0", "pb-6", "px-4 sm:px-6 lg:px-8", "bg-gradient-to-b from-[#E6E9F0] via-[#E6E9F0]/95 to-[#F1F0FB]/90", "backdrop-blur-sm")}>
      <div className={cn("relative z-10 w-full mx-auto", "max-w-7xl", className)}>
        <div className="absolute inset-0 bg-[#E6E9F0]/30 dark:bg-[#1A1F2C]/30 backdrop-blur-md" />
        <div className="absolute inset-0">
          {/* Coins colorés avec dégradés plus doux */}
          <div className="absolute w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-[#64B5D9]/20 to-transparent rounded-tl-3xl" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#1B2A4A]/20 to-transparent rounded-tr-3xl" />
          </div>
          
          
          
          {/* Motif de points avec opacité réduite */}
          
          
          {/* Ajout d'un motif de grille subtil */}
          
        </div>
        {children}
      </div>
    </motion.div>;
}