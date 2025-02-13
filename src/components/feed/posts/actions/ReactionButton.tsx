
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
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex gap-2 items-center transition-colors duration-100",
        "hover:bg-accent active:scale-95",
        isActive && "text-primary font-medium",
        activeClassName
      )}
    >
      <Icon className={cn(
        "h-4 w-4",
        isActive && "fill-current"
      )} />
      <span className="text-sm">{count}</span>
    </Button>
  );
}
