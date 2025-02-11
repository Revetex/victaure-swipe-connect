
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
      className="flex-1 w-full overflow-x-hidden bg-background/50 mt-16"
    >
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </motion.main>
  );
}
