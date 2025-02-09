
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  onShowProfilePreview: () => void;
  className?: string;
}

export function NavigationHeader({ onShowProfilePreview, className }: NavigationHeaderProps) {
  return (
    <div className={cn("h-16 border-b flex items-center px-4", className)}>
      <motion.div 
        className="flex items-center gap-3 group cursor-pointer relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={onShowProfilePreview}
      >
        <Logo size="sm" />
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
      </motion.div>
      
      <div className="ml-auto flex items-center gap-2">
        <motion.span 
          className="text-sm text-muted-foreground hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Propulsez votre carrière avec l'IA
        </motion.span>
      </div>
    </div>
  );
}
