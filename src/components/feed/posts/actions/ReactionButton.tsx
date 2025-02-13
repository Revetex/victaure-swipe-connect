
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
        "flex items-center gap-1.5 px-3 h-8 rounded-full",
        "hover:bg-muted/80 active:scale-95",
        "transition-all duration-200 ease-in-out",
        isActive && activeClassName,
      )}
      title={label}
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-1.5"
      >
        <Icon className={cn(
          "h-4 w-4",
          isActive && "fill-current"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isActive && "text-current"
        )}>{count}</span>
      </motion.div>
    </Button>
  );
}
