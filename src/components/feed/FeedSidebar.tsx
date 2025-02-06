
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { ConnectionsSection } from "./friends/ConnectionsSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "w-[300px] flex-shrink-0 border-r h-[calc(100vh-4rem)] sticky top-[4rem]",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Amis</h2>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/friends")}
            >
              <Users className="h-4 w-4" />
              Demandes d'amis
            </Button>
          </div>

          <ConnectionsSection />
        </div>
      </ScrollArea>
    </div>
  );
}
