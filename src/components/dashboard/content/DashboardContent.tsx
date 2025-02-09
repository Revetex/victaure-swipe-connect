
import { motion, AnimatePresence } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { useEffect } from "react";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
      case 2:
        return <Messages />;
      case 3:
        return <Marketplace />;
      case 4:
        return <Feed />;
      case 5:
        return (
          <div className="h-full">
            <NotesMap />
          </div>
        );
      case 6:
        return <Settings />;
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
