
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "education" | "experience";
}

export function VCardSection({
  title,
  icon,
  children,
  variant = "default"
}: VCardSectionProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={variants}
      className="glass-panel overflow-hidden hover-lift"
    >
      <div className="flex items-center gap-2 p-4 border-b border-white/5">
        {icon && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#9b87f5]"
          >
            {icon}
          </motion.span>
        )}
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-gradient-purple"
        >
          {title}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full p-6 bg-gradient-to-b from-transparent to-white/5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
