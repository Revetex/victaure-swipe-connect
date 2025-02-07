
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
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ToolsList } from "./sidebar/ToolsList";
import { ToolDialog } from "./sidebar/ToolDialog";

interface FeedSidebarProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleCloseSidebar = () => {
    navigate('/dashboard');
  };

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleCloseDialog = () => {
    setActiveTool(null);
  };

  return (
    <>
      <div className={cn(
        "w-[240px] flex-shrink-0 border-r h-[calc(100vh-4rem)] sticky top-[4rem] z-50",
        "bg-background",
        "transition-all duration-300 ease-in-out",
        className
      )}>
        <ScrollArea className="h-full">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2 py-2"
          >
            <motion.div variants={itemVariants}>
              <SidebarHeader onClose={handleCloseSidebar} />
            </motion.div>

            <motion.div variants={itemVariants} className="px-2 space-y-1">
              <h3 className="text-[10px] font-medium text-muted-foreground ml-2 mb-1">Connections</h3>
              <div className="bg-background/50">
                <ConnectionsSection />
              </div>
            </motion.div>

            <Separator className="my-2" />

            <motion.div variants={itemVariants} className="px-2 space-y-1">
              <h3 className="text-[10px] font-medium text-muted-foreground ml-2 mb-1">Outils</h3>
              <ToolsList onToolClick={handleToolClick} />
            </motion.div>

            <Separator className="my-2" />

            <motion.div variants={itemVariants} className="px-2 space-y-1">
              <h3 className="text-[10px] font-medium text-muted-foreground ml-2 mb-1">Paramètres</h3>
              <div className="space-y-0.5">
                <div className="bg-background/50">
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
          </motion.div>
        </ScrollArea>
      </div>

      <ToolDialog 
        activeTool={activeTool} 
        onClose={handleCloseDialog}
      />
    </>
  );
}
