
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export function ReactionButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  activeClassName
}: ReactionButtonProps) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="will-change-transform"
    >
      <Button
        variant={isActive ? 'default' : 'ghost'}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "flex gap-2 items-center transition-all duration-150 min-w-[80px] justify-center",
          isActive && activeClassName
        )}
      >
        <Icon className={cn(
          "h-4 w-4 transition-transform",
          isActive && "scale-110"
        )} />
        <span className="font-medium text-sm">{count}</span>
      </Button>
    </motion.div>
  );
}
