import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  containerVariants: {
    hidden: { opacity: number };
    visible: {
      opacity: number;
      transition: {
        staggerChildren: number;
      };
    };
  };
  className?: string;
}

export function DashboardContainer({
  children,
  containerVariants,
  className
}: DashboardContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "min-h-screen bg-background text-foreground",
        "bg-gradient-to-br from-background via-background/95 to-background/90",
        "dark:from-background dark:via-background/95 dark:to-background/90",
        "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="container mx-auto py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
}