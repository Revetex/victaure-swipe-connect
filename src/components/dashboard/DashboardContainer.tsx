import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  containerVariants: any;
}

export function DashboardContainer({ children, containerVariants }: DashboardContainerProps) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-accent/5 to-background bg-fixed opacity-50" />
      <motion.div 
        className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <main className="relative w-full h-screen overflow-hidden">
        <motion.div 
          className="h-full w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}