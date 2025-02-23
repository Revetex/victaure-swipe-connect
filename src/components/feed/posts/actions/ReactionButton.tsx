
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReactionButtonProps {
  icon: LucideIcon;
  count: number;
  suffix?: string;
  isActive?: boolean;
  onClick: () => void;
  activeClassName?: string;
}

export function ReactionButton({
  icon: Icon,
  count,
  suffix,
  isActive,
  onClick,
  activeClassName
}: ReactionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 font-medium hover:bg-muted/10",
        isActive && activeClassName
      )}
    >
      <Icon className={cn("w-4 h-4", isActive && "animate-bounce")} />
      <span className="min-w-[20px] text-center">{count}{suffix}</span>
    </Button>
  );
}
