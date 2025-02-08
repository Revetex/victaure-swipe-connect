
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { ToolsList } from "./sidebar/ToolsList";
import { useNavigate } from "react-router-dom";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();

  const handleToolClick = (toolName: string) => {
    navigate('/tools');
  };

  return (
    <div 
      className={cn(
        "w-full h-full bg-background/80 backdrop-blur-sm",
        "relative overflow-hidden",
        className
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Connexions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase px-2">
              Connexions
            </h3>
            <div className="bg-card/50 rounded-lg p-2">
              <ConnectionsSection />
            </div>
          </div>

          {/* Outils */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase px-2">
              Outils
            </h3>
            <div className="bg-card/50 rounded-lg p-2">
              <ToolsList onToolClick={handleToolClick} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
