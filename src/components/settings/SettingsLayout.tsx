import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

export function SettingsLayout({ children, className }: SettingsLayoutProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "min-h-screen bg-background relative overflow-hidden p-4 md:p-6",
        "bg-gradient-to-br from-background via-background/95 to-background/90",
        className
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] z-0" />
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
          {children}
        </div>
      </div>
    </motion.div>
  );
}