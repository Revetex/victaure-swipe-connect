import { ReactNode } from "react";
import { motion } from "framer-motion";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function VCardSection({ title, icon, children, className = "" }: VCardSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-border/30 dark:border-border/20">
        <div className="text-primary/90 dark:text-primary/80">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground/90 dark:text-foreground/80">{title}</h3>
      </div>
      <div className="pt-2 text-foreground/80 dark:text-foreground/70">
        {children}
      </div>
    </motion.div>
  );
}