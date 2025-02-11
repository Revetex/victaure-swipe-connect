
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesSection } from "@/components/notes/NotesSection";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendsList } from "@/components/feed/FriendsList";
import { cn } from "@/lib/utils";

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
    const commonClasses = cn(
      "min-h-[calc(100vh-4rem)]", // Full height minus header
      "w-full max-w-7xl mx-auto", // Max width and center
      "px-4 sm:px-6 lg:px-8", // Responsive padding
      "pt-4 pb-8" // Reduced top padding + bottom padding
    );

    switch (currentPage) {
      case 1:
        return <div className={commonClasses}><VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} /></div>;
      case 2:
        return <div className={commonClasses}><Messages /></div>;
      case 3:
        return <div className={commonClasses}><Marketplace /></div>;
      case 4:
        return <div className={commonClasses}><Feed /></div>;
      case 7:
        return <div className={commonClasses}><TasksPage /></div>;
      case 8:
        return <div className={commonClasses}><CalculatorPage /></div>;
      case 9:
        return <div className={commonClasses}><NotificationsTab /></div>;
      case 10:
        return <div className={commonClasses}><Settings /></div>;
      case 12:
        return <div className={commonClasses}><FriendsList /></div>;
      case 14:
        return <div className={commonClasses}><TranslatorPage /></div>;
      case 15:
        return <div className={commonClasses}><ChessPage /></div>;
      case 16:
        return <div className={commonClasses}><NotesSection /></div>;
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
      className="relative bg-background pt-16"
    >
      {getPageContent()}
    </motion.div>
  );
}
