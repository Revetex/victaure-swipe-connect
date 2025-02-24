
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionsHeaderProps {
  showPendingRequests: boolean;
  onTogglePendingRequests: () => void;
}

export function ConnectionsHeader({ 
  showPendingRequests, 
  onTogglePendingRequests 
}: ConnectionsHeaderProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full flex items-center justify-between p-3",
        "hover:bg-accent/5 transition-colors duration-300",
        "font-medium tracking-tight"
      )}
      onClick={onTogglePendingRequests}
    >
      <span className="text-sm bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70 bg-clip-text text-transparent">
        Demandes en attente
      </span>
      {showPendingRequests ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
