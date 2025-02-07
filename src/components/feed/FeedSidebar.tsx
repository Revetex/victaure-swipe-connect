
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
import { motion, AnimatePresence } from "framer-motion";
import { ToolsList } from "./sidebar/ToolsList";
import { ToolDialog } from "./sidebar/ToolDialog";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("connections");

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleCloseDialog = () => {
    setActiveTool(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sectionClasses = "px-4 py-3 hover:bg-accent/5 transition-colors rounded-lg cursor-pointer";
  const labelClasses = "text-sm font-medium text-muted-foreground tracking-wider uppercase";

  return (
    <>
      <div className={cn(
        "h-full flex flex-col bg-background/95 backdrop-blur-sm",
        className
      )}>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2 p-4 rounded-lg bg-card/50"
            >
              <div className="h-20 w-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                {/* Avatar placeholder */}
                <span className="text-2xl font-semibold text-primary">VP</span>
              </div>
              <h2 className="font-semibold text-lg">Votre Profil</h2>
              <p className="text-sm text-muted-foreground">Gérez votre présence en ligne</p>
            </motion.div>

            <Separator />

            {/* Connections Section */}
            <div>
              <div 
                onClick={() => toggleSection('connections')}
                className={sectionClasses}
              >
                <h3 className={labelClasses}>Connexions</h3>
              </div>
              <AnimatePresence>
                {expandedSection === 'connections' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden px-4"
                  >
                    <ConnectionsSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            {/* Tools Section */}
            <div>
              <h3 className={cn(labelClasses, "px-4 mb-2")}>Outils</h3>
              <ToolsList onToolClick={handleToolClick} />
            </div>

            <Separator />

            {/* Settings Section */}
            <div>
              <div 
                onClick={() => toggleSection('settings')}
                className={sectionClasses}
              >
                <h3 className={labelClasses}>Paramètres</h3>
              </div>
              <AnimatePresence>
                {expandedSection === 'settings' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-2 px-4"
                  >
                    <AppearanceSection />
                    <NotificationsSection />
                    <PrivacySection />
                    <SecuritySection />
                    <BlockedUsersSection />
                    <Separator className="my-2" />
                    <LogoutSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </div>

      <ToolDialog 
        activeTool={activeTool} 
        onClose={handleCloseDialog}
      />
    </>
  );
}
