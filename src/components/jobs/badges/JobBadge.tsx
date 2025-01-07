import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface JobBadgeProps {
  icon: LucideIcon;
  label: string;
  tooltip: string;
  colorClass?: string;
  children?: React.ReactNode;
}

export function JobBadge({ icon: Icon, label, tooltip, colorClass = "bg-primary/10 hover:bg-primary/20", children }: JobBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className={`flex items-center gap-1 ${colorClass} transition-colors`}>
            <Icon className="h-3 w-3" />
            {label}
            {children}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}