
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { Feed } from "@/components/feed/Feed";
import { ChessPage } from "@/components/tools/ChessPage";
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
    const variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const content = (() => {
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
          return <NotesMap />;
        case 6:
          return <ChessPage />;
        case 7:
          return <Settings />;
        default:
          return null;
      }
    })();

    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}
