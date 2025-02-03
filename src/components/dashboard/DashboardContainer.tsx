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
        "relative overflow-hidden",
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}