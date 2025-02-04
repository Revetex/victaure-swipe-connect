import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { Feed } from "@/components/Feed";
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
  // Auto-open board when accessing notes section
  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="w-full p-4 overflow-y-auto">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        );
      case 2:
        return (
          <div className="w-full p-4 overflow-y-auto">
            <Messages />
          </div>
        );
      case 3:
        return (
          <div className="w-full p-4 overflow-y-auto">
            <Marketplace />
          </div>
        );
      case 4:
        return (
          <div className="h-full">
            <Feed />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full px-4 overflow-hidden">
            <div className="w-full h-full">
              <NotesMap />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full p-4 overflow-y-auto">
            <Settings />
          </div>
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
      className="w-full h-full overflow-hidden"
      style={{
        height: isEditing ? `calc(${viewportHeight}px - 80px)` : '100%',
        overflowY: 'auto'
      }}
    >
      {renderContent()}
    </motion.div>
  );
}