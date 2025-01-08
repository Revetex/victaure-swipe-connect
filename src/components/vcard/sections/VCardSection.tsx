import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StyleOption } from "../types";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  selectedStyle?: StyleOption;
  isEditing?: boolean;
}

export function VCardSection({ 
  title, 
  icon, 
  children, 
  className = "",
  selectedStyle,
  isEditing
}: VCardSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "space-y-4 p-6 rounded-xl transition-colors",
        isEditing ? "hover:bg-accent/50" : "bg-card/50",
        className
      )}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <div className="text-primary dark:text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}