import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  containerVariants: any;
}

export function DashboardContainer({ children, containerVariants }: DashboardContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <main className="flex-1 relative">
        <div className="container mx-auto px-4 py-6 pb-24 h-[calc(100vh-8rem)] overflow-y-auto">
          <motion.div 
            className="max-w-[1200px] mx-auto h-full"
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