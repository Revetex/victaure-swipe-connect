
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
      className="flex-1 w-full px-4 sm:px-6 lg:px-8 overflow-x-hidden"
    >
      <div className="w-full max-w-7xl mx-auto py-4 sm:py-6">
        {children}
      </div>
    </motion.main>
  );
}
