import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  containerVariants: any;
}

export function DashboardContainer({ children, containerVariants }: DashboardContainerProps) {
  return (
    <div className="min-h-screen w-full">
      <div className="fixed inset-0 w-full min-h-screen bg-dashboard-pattern bg-cover bg-center bg-fixed" />
      <div className="fixed inset-0 w-full min-h-screen bg-background/80 backdrop-blur-[2px]" />
      <main className="relative z-10 min-h-screen w-full">
        <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
          <motion.div 
            className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col"
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