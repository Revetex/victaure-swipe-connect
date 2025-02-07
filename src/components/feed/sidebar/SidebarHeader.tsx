
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <motion.div 
      className="flex items-center justify-between px-2 py-3"
    >
      <h2 className="text-sm font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Navigation
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
