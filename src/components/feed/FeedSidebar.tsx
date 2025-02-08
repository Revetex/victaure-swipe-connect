
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
import { UserProfile } from "@/types/profile";
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
    <motion.div 
      className={cn(
        "fixed top-16 left-0 w-[280px] h-[calc(100vh-4rem)] bg-background/95 backdrop-blur-sm border-r z-[99997]",
        className
      )}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          {/* Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase">
              Paramètres
            </h3>
            <div className="space-y-1">
              <AppearanceSection />
              <NotificationsSection />
              <PrivacySection />
              <SecuritySection />
              <BlockedUsersSection />
              <LogoutSection />
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-tight uppercase">
              Outils
            </h3>
            <ToolsList onToolClick={handleToolClick} />
          </div>

          {/* Connections */}
          <ConnectionsSection />
        </div>
      </ScrollArea>
    </motion.div>
  );
}
