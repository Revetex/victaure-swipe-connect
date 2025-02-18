
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesSection } from "@/components/notes/NotesSection";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendsList } from "@/components/feed/FriendsList";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { DashboardFriendsList } from "./DashboardFriendsList";
import { JobActions } from "./JobActions";
import { DashboardChart } from "./DashboardChart";
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
  const [showFriendsList, setShowFriendsList] = useState(false);

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

  const renderDashboardHome = () => {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="col-span-full lg:col-span-2"
          >
            <DashboardStats />
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <DashboardChart />
          </motion.div>
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuickActions onRequestChat={onRequestChat} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RecentActivity />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <JobActions />
          </motion.div>
        </div>

        {showFriendsList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          >
            <div className="container flex items-center justify-center min-h-screen">
              <DashboardFriendsList 
                show={showFriendsList} 
                onClose={() => setShowFriendsList(false)} 
              />
            </div>
          </motion.div>
        )}
      </div>
    );
  };

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
      default:
        return renderDashboardHome();
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "min-h-screen w-full",
        "bg-gradient-to-b from-background via-background/95 to-background/90",
        "backdrop-blur-sm"
      )}
    >
      <div className="relative">
        {renderContent()}
      </div>
    </motion.div>
  );
}
