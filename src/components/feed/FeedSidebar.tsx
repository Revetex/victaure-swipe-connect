
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { motion } from "framer-motion";
import { ToolsList } from "./sidebar/ToolsList";

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

  const sectionClasses = "px-4 py-3 hover:bg-accent/5 transition-colors rounded-lg cursor-pointer";
  const labelClasses = "text-sm font-medium text-muted-foreground tracking-wider uppercase";

  return (
    <div className={cn(
      "h-full flex flex-col bg-background/95 backdrop-blur-sm",
      className
    )}>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className={cn(labelClasses, "px-4 mb-2")}>Outils</h3>
            <ToolsList onToolClick={handleToolClick} />
          </div>

          <Separator />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h3 className={cn(labelClasses, "px-4")}>Connexions</h3>
              <ConnectionsSection />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className={cn(labelClasses, "px-4")}>Paramètres</h3>
              <div className="space-y-2 px-4">
                <AppearanceSection />
                <NotificationsSection />
                <PrivacySection />
                <SecuritySection />
                <BlockedUsersSection />
                <Separator className="my-2" />
                <LogoutSection />
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
