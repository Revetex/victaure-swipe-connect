
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
      className={cn(
        "select-none",
        isMobile ? "w-full flex justify-center" : "",
        className
      )}
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
          <div className="relative ml-3">
            <img 
              src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
              alt="Victaure Logo" 
              className={cn(
                logoSizes[size],
                "object-contain drop-shadow"
              )}
            />
            <motion.div 
              className="absolute -bottom-3 right-0 transform translate-x-1/4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <img 
                src="/lovable-uploads/168ba21b-e221-4668-96cc-eb026041a0ed.png" 
                alt="Signature" 
                className={cn(
                  "w-[60px] h-auto",
                  "opacity-70 dark:opacity-60",
                  "mix-blend-multiply dark:mix-blend-screen"
                )}
                style={{
                  filter: "contrast(1.2) brightness(0.9)"
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
