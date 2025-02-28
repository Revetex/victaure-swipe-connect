
import { useState } from "react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ToolsList } from "./sidebar/ToolsList";
import { ConnectionsSection } from "./friends/ConnectionsSection";
import { cn } from "@/lib/utils";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const [searchText, setSearchText] = useState("");
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  const togglePendingRequests = () => {
    setShowPendingRequests(!showPendingRequests);
  };

  // Fonction fictive pour l'événement onToolClick
  const handleToolClick = (toolId: string) => {
    console.log(`Tool clicked: ${toolId}`);
  };

  return (
    <aside 
      className={cn(
        "h-full flex flex-col",
        "bg-black/10 dark:bg-black/20 backdrop-blur-sm",
        "border-r border-white/5 transition-all duration-300",
        className
      )}
    >
      <SidebarHeader searchText={searchText} setSearchText={setSearchText} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pl-0 space-y-6">
        <div className="pl-4">
          <ToolsList onToolClick={handleToolClick} />
        </div>
        
        <div className="pl-4">
          <ConnectionsSection 
            searchQuery={searchText} 
            onTogglePending={togglePendingRequests} 
            showPendingRequests={showPendingRequests}
          />
        </div>
      </div>
    </aside>
  );
}
