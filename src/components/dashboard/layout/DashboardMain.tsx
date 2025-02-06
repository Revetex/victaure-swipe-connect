import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardMainProps {
  children: ReactNode;
}

const mainVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <motion.main 
      variants={mainVariants}
      className="flex-1 container mx-auto px-4 relative z-0"
    >
      <div className="max-w-7xl mx-auto py-4">
        {children}
      </div>
    </motion.main>
  );
}