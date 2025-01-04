import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  containerVariants: any;
}

export function DashboardContainer({ children, containerVariants }: DashboardContainerProps) {
  return (
    <div className="relative min-h-screen overflow-hidden overscroll-none">
      <div className="fixed inset-0 bg-dashboard-pattern bg-cover bg-center bg-fixed" />
      <div className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
      <main className="relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}