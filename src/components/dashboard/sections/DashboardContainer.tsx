import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardContainer({ children, className }: DashboardContainerProps) {
  return (
    <div className={cn(
      "fixed inset-0 flex flex-col",
      "bg-dashboard-pattern bg-cover bg-center bg-fixed",
      className
    )}>
      <div className="relative z-10 flex-1 overflow-auto py-2 sm:py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <motion.div 
          className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-[2000px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}