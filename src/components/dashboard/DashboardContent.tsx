
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { Feed } from "@/components/Feed";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/hooks/useUserSettings";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

const menuPages = {
  PROFILE: 1,
  MESSAGES: 2,
  MARKETPLACE: 3,
  FEED: 4,
  NOTES: 5,
  SETTINGS: 6,
} as const;

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { navPreferences } = useUserSettings();
  
  useEffect(() => {
    if (currentPage === menuPages.NOTES) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  const renderContent = () => {
    // If page is hidden in user preferences, return null
    if (navPreferences?.hidden_items?.includes(currentPage.toString())) {
      return null;
    }

    switch (currentPage) {
      case menuPages.PROFILE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
          </motion.div>
        );
      case menuPages.MESSAGES:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Messages />
          </motion.div>
        );
      case menuPages.MARKETPLACE:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <Marketplace />
          </motion.div>
        );
      case menuPages.FEED:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <Feed />
          </motion.div>
        );
      case menuPages.NOTES:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("h-full", isEditing && "bg-background/95 backdrop-blur-sm")}
          >
            <NotesMap />
          </motion.div>
        );
      case menuPages.SETTINGS:
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <Settings />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {renderContent()}
    </motion.div>
  );
}
