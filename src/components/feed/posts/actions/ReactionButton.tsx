
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";

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
        isActive && "bg-accent/20 text-accent font-medium",
        activeClassName
      )}
      title={label}
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-2"
      >
        <Icon className={cn(
          "h-4 w-4",
          isActive && "fill-current text-accent"
        )} />
        <span className="text-sm font-medium">{count}</span>
      </motion.div>
    </Button>
  );
}
