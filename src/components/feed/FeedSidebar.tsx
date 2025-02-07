
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ToolsList } from "./sidebar/ToolsList";
import { ToolDialog } from "./sidebar/ToolDialog";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <motion.div 
        className={cn(
          "fixed left-0 top-[4rem] z-40 h-[calc(100vh-4rem)]",
          "bg-background/95 backdrop-blur-sm border-r",
          "shadow-lg shadow-background/5",
          isCollapsed ? "w-16" : "w-[320px]",
          className
        )}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 320 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-50 rounded-full bg-background border shadow-md"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <ScrollArea className="h-full">
          <AnimatePresence mode="wait">
            <div className="space-y-6 p-4">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SidebarHeader />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {!isCollapsed && (
                  <>
                    <div
                      onClick={() => toggleSection('connections')}
                      className="cursor-pointer"
                    >
                      <h3 className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-2 hover:text-primary transition-colors">
                        Connexions
                      </h3>
                      {expandedSection === 'connections' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ConnectionsSection />
                        </motion.div>
                      )}
                    </div>

                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-2">
                    Outils
                  </h3>
                  <ToolsList onToolClick={handleToolClick} />
                </div>

                {!isCollapsed && (
                  <>
                    <Separator />

                    <div
                      onClick={() => toggleSection('settings')}
                      className="cursor-pointer"
                    >
                      <h3 className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-2 hover:text-primary transition-colors">
                        Paramètres
                      </h3>
                      {expandedSection === 'settings' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
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
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </AnimatePresence>
        </ScrollArea>
      </motion.div>

      <ToolDialog 
        activeTool={activeTool} 
        onClose={handleCloseDialog}
      />
    </>
  );
}
