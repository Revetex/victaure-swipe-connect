
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/marketplace/Marketplace";
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
import { JobsPage } from "@/components/jobs/JobsPage";
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
    switch (currentPage) {
      case 1:
        return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
      case 2:
        return <Messages />;
      case 3:
        return <JobsPage />; // Page des emplois complète avec ScrapedJobs
      case 4:
        return <Feed />;
      case 7:
        return <TasksPage />;
      case 8:
        return <CalculatorPage />;
      case 9:
        return <NotificationsTab />;
      case 10:
        return <Settings />;
      case 12:
        return <FriendsList />;
      case 14:
        return <TranslatorPage />;
      case 15:
        return <ChessPage />;
      case 16:
        return <NotesSection />;
      case 17:
        return <Marketplace />;
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
      className={cn(
        "relative bg-background min-h-screen w-full",
        "lg:p-6"
      )}
    >
      {getPageContent()}
    </motion.div>
  );
}
