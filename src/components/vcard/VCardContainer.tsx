
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
  }} className={cn(
    "min-h-[calc(100vh-4rem)]", 
    "w-full", 
    "pt-0 pb-6", 
    "px-4 sm:px-6 lg:px-8", 
    "bg-gradient-to-br from-[#1A1F2C] via-[#1B2A4A]/90 to-[#1A1F2C]",
    "backdrop-blur-sm"
  )}>
      <div className={cn(
        "relative z-10 w-full mx-auto", 
        "max-w-7xl", 
        "bg-gradient-to-br from-[#9b87f5]/5 to-transparent", 
        "rounded-xl shadow-lg", 
        "border border-[#9b87f5]/10", 
        "overflow-hidden", 
        className
      )}>
        <div className="absolute inset-0">
          {/* Effets de fond */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#9b87f5]/10 to-transparent rounded-full translate-y-32 -translate-x-32 blur-2xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7E69AB]/10 to-transparent rounded-full -translate-y-32 translate-x-32 blur-2xl" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9b87f5]/20 to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>;
}
