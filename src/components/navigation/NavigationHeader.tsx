
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface NavigationHeaderProps {
  onShowProfilePreview: () => void;
  className?: string;
}

export function NavigationHeader({ onShowProfilePreview, className }: NavigationHeaderProps) {
  return (
    <div className={cn("h-16 border-b flex items-center px-4 bg-background/95 backdrop-blur-sm", className)}>
      <motion.div 
        className="flex items-center gap-3 group cursor-pointer relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={onShowProfilePreview}
      >
        <Logo size="sm" />
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gray-400/50 via-gray-400 to-gray-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
      </motion.div>
      
      <div className="ml-auto flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-2 text-sm text-muted-foreground hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Protection des données garantie</span>
        </motion.div>
      </div>
    </div>
  );
}
