import { motion, AnimatePresence } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/settings/SettingsContainer";
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

  const variants = {
    initial: { 
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    animate: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      transition: {
        duration: 0.3
      }
    }
  };

  const renderContent = () => {
    const content = (() => {
      switch (currentPage) {
        case 1:
          return <Feed />;
        case 2:
          return <Messages />;
        case 3:
          return <Marketplace />;
        case 4:
          return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
        case 5:
          return (
            <div className="h-full">
              <NotesMap />
            </div>
          );
        case 10:
          return <Settings />;
        default:
          return null;
      }
    })();

    return (
      <motion.div
        key={currentPage}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
