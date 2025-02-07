
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
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12
    }
  }
};

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("connections");

  const handleCloseSidebar = () => {
    navigate('/dashboard');
  };

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleCloseDialog = () => {
    setActiveTool(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      <motion.div 
        className={cn(
          "w-[280px] border-r h-[calc(100vh-4rem)]",
          "bg-background/95 backdrop-blur-sm fixed left-0 top-[4rem] z-40",
          "shadow-lg shadow-background/5",
          className
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <ScrollArea className="h-full px-2">
          <motion.div className="space-y-4 py-4" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <SidebarHeader onClose={handleCloseSidebar} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                variants={itemVariants}
                onClick={() => toggleSection('connections')}
                className="cursor-pointer"
              >
                <div className="px-2">
                  <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-2 hover:text-primary transition-colors">
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
              </motion.div>
            </AnimatePresence>

            <Separator className="my-2" />

            <motion.div variants={itemVariants}>
              <div className="px-2">
                <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-2">
                  Outils
                </h3>
                <ToolsList onToolClick={handleToolClick} />
              </div>
            </motion.div>

            <Separator className="my-2" />

            <AnimatePresence mode="wait">
              <motion.div 
                variants={itemVariants}
                onClick={() => toggleSection('settings')}
                className="cursor-pointer"
              >
                <div className="px-2">
                  <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-2 hover:text-primary transition-colors">
                    Paramètres
                  </h3>
                  {expandedSection === 'settings' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1"
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
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </ScrollArea>
      </motion.div>

      <ToolDialog 
        activeTool={activeTool} 
        onClose={handleCloseDialog}
      />
    </>
  );
}
