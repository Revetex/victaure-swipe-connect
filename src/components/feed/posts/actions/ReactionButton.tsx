
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
    <motion.div whileTap={{ scale: 0.95 }} className="will-change-transform">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "flex gap-1.5 items-center transition-colors duration-200 h-8 px-2",
          "hover:bg-accent",
          isActive && activeClassName
        )}
      >
        <Icon className={cn(
          "h-3.5 w-3.5",
          isActive && "fill-current"
        )} />
        <span className="text-xs font-medium">{count}</span>
      </Button>
    </motion.div>
  );
}
