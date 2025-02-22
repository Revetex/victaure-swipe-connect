
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import "@/styles/shared.css";

interface VCardContainerProps {
  children: ReactNode;
  className?: string;
}

export function VCardContainer({ children, className }: VCardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      <div className={cn(
        "relative z-10 w-full mx-auto",
        "py-4 sm:py-6 lg:py-8",
        "max-w-7xl",
        className
      )}>
        {children}
      </div>
    </motion.div>
  );
}
