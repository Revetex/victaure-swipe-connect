
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
      damping: 15
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
        "min-h-[calc(100vh-4rem)] w-full bg-background mt-16 pt-8",
        "bg-gradient-to-br from-background via-background/95 to-background/90",
        "pb-40", // Augmenté le padding bottom pour la navigation
        className
      )}
    >
      <div className="h-full w-full max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>
    </motion.div>
  );
}
