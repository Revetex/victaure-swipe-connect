import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface VCardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function VCardSection({ title, icon, children, className = "" }: VCardSectionProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
      style={{ color: selectedStyle.colors.text.primary }}
    >
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: `1px solid ${selectedStyle.colors.primary}20` }}>
        <div style={{ color: selectedStyle.colors.primary }}>
          {icon}
        </div>
        <h3 
          className="text-lg font-semibold"
          style={{ color: selectedStyle.colors.text.primary }}
        >
          {title}
        </h3>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  );
}