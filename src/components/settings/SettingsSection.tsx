
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  children,
  className
}: SettingsSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-4", className)}
    >
      <div className="w-full space-y-1 rounded-lg border border-border/50 p-4 backdrop-blur glass-panel">
        <h3 className="text-sm font-medium text-gradient-primary mb-3">{title}</h3>
        <div className="space-y-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
