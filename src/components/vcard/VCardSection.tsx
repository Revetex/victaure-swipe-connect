import { ReactNode } from "react";
import { motion } from "framer-motion";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onToggle?: () => void;
}

export function VCardSection({ 
  title, 
  icon, 
  children, 
  className = "",
  isActive,
  onToggle
}: VCardSectionProps) {
  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`flex items-center gap-2 ${onToggle ? 'cursor-pointer' : ''}`}
        onClick={onToggle}
      >
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}