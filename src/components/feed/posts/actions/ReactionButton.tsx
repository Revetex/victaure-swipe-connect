
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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "flex gap-2 items-center px-4 py-2 rounded-full transition-all duration-200",
        "hover:bg-accent/10 active:scale-95",
        "relative overflow-hidden",
        isActive && "bg-gradient-to-r from-accent/20 to-accent/10 text-accent font-medium shadow-sm",
        activeClassName
      )}
      title={label}
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-2"
      >
        <Icon className={cn(
          "h-4 w-4 transition-colors",
          isActive && "fill-current text-accent animate-pulse"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isActive && "text-accent"
        )}>{count}</span>
      </motion.div>
    </Button>
  );
}
