import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl"
};

export function Logo({ size = "md", className }: LogoProps) {
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
        <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          VICTAURE
        </span>
      </motion.div>
    </motion.div>
  );
}