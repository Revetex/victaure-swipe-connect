
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
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";

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

  const handleProfileSelect = (profile: UserProfile) => {
    navigate(`/profile/${profile.id}`);
  };

  const labelClasses = "text-sm font-medium text-muted-foreground tracking-tight uppercase mb-2";

  return (
    <motion.div 
      className={cn(
        "fixed inset-y-0 left-0 w-[280px] sm:w-[350px] bg-background/95 backdrop-blur-sm",
        "shadow-xl border-r z-[99998]",
        className
      )}
      initial={{ x: -350 }}
      animate={{ x: 0 }}
      exit={{ x: -350 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <div className="relative h-full overflow-hidden">
        <ScrollArea className="h-[100vh] w-full absolute inset-0">
          <div className="p-4 space-y-6 pb-32">
            <div>
              <h3 className={labelClasses}>Recherche</h3>
              <ProfileSearch 
                onSelect={handleProfileSelect}
                placeholder="Rechercher des profils..."
                className="w-full"
              />
            </div>

            <div>
              <h3 className={labelClasses}>Outils</h3>
              <ToolsList onToolClick={handleToolClick} />
            </div>

            <Separator />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className={labelClasses}>Connexions</h3>
                <ConnectionsSection />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className={labelClasses}>Paramètres</h3>
                <div className="space-y-2">
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
    </motion.div>
  );
}

