
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export function ReactionButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  activeClassName,
}: ReactionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 font-medium",
        isActive && activeClassName
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{count}</span>
    </Button>
  );
}
