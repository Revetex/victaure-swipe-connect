
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl"
};

const logoSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12"
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
          "font-sans font-bold tracking-wider",
          "relative flex items-center justify-center",
          "transition-all duration-500",
          textSizes[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center justify-center relative">
          <span className="font-inter text-zinc-900 dark:text-white font-black tracking-tight">
            VICTAURE
          </span>
          <img 
            src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
            alt="Victaure Logo" 
            className={cn(
              logoSizes[size],
              "object-contain drop-shadow ml-3"
            )}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
