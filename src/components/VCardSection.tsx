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
      <div className="flex items-center gap-2 pb-2 border-b border-indigo-100 dark:border-indigo-900/30">
        <div className="text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}