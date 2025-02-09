
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationHeaderProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onShowProfile: () => void;
}

export function NavigationHeader({ 
  isFullscreen, 
  onToggleFullscreen, 
  onShowProfile 
}: NavigationHeaderProps) {
  return (
    <div className="h-12 border-b flex items-center justify-between px-3">
      <motion.div 
        className="flex items-center gap-2 group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={onShowProfile}
      >
        <Logo size="sm" />
      </motion.div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFullscreen}
        className="hover:bg-accent/50"
        title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
