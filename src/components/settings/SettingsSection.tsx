
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-2", className)}
    >
      <div className="w-full space-y-1 rounded-lg border border-border/50 p-3 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">{title}</h3>
        {children}
      </div>
    </motion.div>
  );
}
