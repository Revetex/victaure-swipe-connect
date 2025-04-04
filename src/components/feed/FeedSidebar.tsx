
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { motion } from "framer-motion";
import { ToolsList } from "./sidebar/ToolsList";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
    navigate('/tools');
  };

  return (
    <div 
      className={cn(
        "w-full h-full bg-background/80 backdrop-blur-sm border-r border-border/50",
        "relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/10 pointer-events-none" />
      
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

          {/* Paramètres */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase px-2">
              Paramètres
            </h3>
            <div className="bg-card/50 rounded-lg p-2 space-y-1">
              <AppearanceSection />
              <NotificationsSection />
              <PrivacySection />
              <SecuritySection />
              <BlockedUsersSection />
              <LogoutSection />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
