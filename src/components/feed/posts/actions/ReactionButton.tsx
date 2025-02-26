
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
  // Transformer le count en valeur affichée immédiatement
  const displayCount = count < 0 ? 0 : count;

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick} 
      className={cn(
        "flex items-center gap-1.5 font-medium transition-all duration-200 hover:bg-muted/10", 
        isActive && activeClassName
      )}
    >
      <Icon 
        className={cn(
          "w-4 h-4 transition-all duration-200", 
          isActive && "scale-110"
        )} 
      />
      <span className="min-w-[20px] text-center text-base font-semibold text-slate-50">
        {displayCount}{suffix}
      </span>
    </Button>
  );
}
