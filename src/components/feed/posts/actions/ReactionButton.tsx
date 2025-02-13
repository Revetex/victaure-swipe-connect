
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
  label: string;
}

export function ReactionButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  activeClassName,
  label
}: ReactionButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-full",
        "text-sm font-medium",
        "bg-transparent hover:bg-accent/10",
        "transition-all duration-200",
        "border border-transparent",
        "focus:outline-none focus:ring-2 focus:ring-accent/20",
        isActive && [
          "bg-accent/10",
          "border-accent/20",
          "text-accent",
          activeClassName
        ]
      )}
      title={label}
    >
      <Icon className={cn(
        "h-4 w-4",
        "transition-all duration-200",
        isActive && "fill-current text-accent"
      )} />
      <span className={cn(
        "min-w-[1rem] text-center",
        isActive && "text-accent font-semibold"
      )}>
        {count}
      </span>
    </motion.button>
  );
}
