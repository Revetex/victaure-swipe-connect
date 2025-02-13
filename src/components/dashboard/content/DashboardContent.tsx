
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
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendsList } from "@/components/feed/FriendsList";

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  const pageVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const getPageContent = () => {
    switch (currentPage) {
      case 1:
        return <Feed />;
      case 2:
        return (
          <div className="max-w-5xl mx-auto">
            <Messages />
          </div>
        );
      case 3:
        return <FriendsList />;
      case 4:
        return <Marketplace />;
      case 5:
        return <NotesSection />;
      case 6:
        return <TasksPage />;
      case 7:
        return <CalculatorPage />;
      case 8:
        return <TranslatorPage />;
      case 9:
        return <ChessPage />;
      case 10:
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative bg-background min-h-screen pt-16 pb-20"
    >
      <div className="container mx-auto px-4">
        {getPageContent()}
      </div>
    </motion.div>
  );
}
