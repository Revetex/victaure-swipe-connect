
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { FriendsPage } from "@/components/friends/FriendsPage";
import { FriendRequestsPage } from "@/components/friends/FriendRequestsPage";
import { ProfileSearchPage } from "@/components/friends/ProfileSearchPage";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
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
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  const variants = {
    initial: { 
      opacity: 0,
      y: 10
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
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
      case 7:
        return <TasksPage />;
      case 8:
        return <CalculatorPage />;
      case 9:
        return <NotificationsTab />;
      case 10:
        return <Settings />;
      case 12:
        return <FriendRequestsPage />;
      case 13:
        return <ProfileSearchPage />;
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
      className="w-full h-full"
    >
      {content}
    </motion.div>
  );
}
