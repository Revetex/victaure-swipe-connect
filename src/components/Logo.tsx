
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSparkle?: boolean;
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl"
};

export function Logo({ size = "md", className, showSparkle = true }: LogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      className={cn("select-none", className)}
    >
      <motion.div 
        className={cn(
          "font-sans font-bold tracking-wider uppercase",
          "relative",
          "transition-all duration-500",
          textSizes[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
          VICTAURE
        </span>
        {showSparkle && (
          <motion.div 
            className="absolute -top-2 -right-4"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Shield className="h-4 w-4 text-emerald-500" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
