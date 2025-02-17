
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JobBadgeProps {
  icon: LucideIcon;
  label: string;
  tooltip?: string;
  colorClass?: string;
}

export function JobBadge({ 
  icon: Icon, 
  label, 
  tooltip, 
  colorClass = "bg-blue-500/10 hover:bg-blue-500/20" 
}: JobBadgeProps) {
  const badge = (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-colors",
      "cursor-default",
      colorClass
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
