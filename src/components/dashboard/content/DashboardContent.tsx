
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendRequestsPage } from "@/components/friends/FriendRequestsPage";
import { ProfileSearchPage } from "@/components/friends/ProfileSearchPage";

interface DashboardContentProps {
  currentPage: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  if (!user) {
    return <Loader className="w-8 h-8" />;
  }

  const variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.15 }
    }
  };

  const getPageContent = () => {
    const commonClasses = "min-h-screen pt-16 px-4";

    switch (currentPage) {
      case 1:
        return <div className={commonClasses}><VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} /></div>;
      case 2:
        return <div className={commonClasses}><Messages /></div>;
      case 3:
        return <div className={commonClasses}><Marketplace /></div>;
      case 4:
        return <div className={commonClasses}><Feed /></div>;
      case 5:
        return <div className={commonClasses}><NotesMap /></div>;
      case 7:
        return <div className={commonClasses}><TasksPage /></div>;
      case 8:
        return <div className={commonClasses}><CalculatorPage /></div>;
      case 9:
        return <div className={commonClasses}><NotificationsTab /></div>;
      case 10:
        return <div className={commonClasses}><Settings /></div>;
      case 11:
        return <div className={commonClasses}><ChessPage /></div>;
      case 12:
        return <div className={commonClasses}><FriendRequestsPage /></div>;
      case 13:
        return <div className={commonClasses}><ProfileSearchPage /></div>;
      case 14:
        return <div className={commonClasses}><TranslatorPage /></div>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto"
    >
      {getPageContent()}
    </motion.div>
  );
}
