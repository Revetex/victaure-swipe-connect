import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  containerVariants: any;
}

export function DashboardContainer({ children, containerVariants }: DashboardContainerProps) {
  return (
    <div className="min-h-[100vh] min-h-[100dvh] w-full flex flex-col relative">
      <div className="fixed inset-0 w-full h-full bg-dashboard-pattern bg-cover bg-center bg-fixed z-0" />
      <div className="fixed inset-0 w-full h-full bg-background/80 backdrop-blur-[2px] z-0" />
      <main className="relative z-10 flex-1 flex flex-col w-full">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
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