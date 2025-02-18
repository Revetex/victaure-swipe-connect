
import { motion, AnimatePresence } from "framer-motion";
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
import { useViewport } from "@/hooks/useViewport";
import { Sparkles, Radio, Zap } from "lucide-react";

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
  const { width } = useViewport();
  const isMobile = width < 768;

  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-full bg-primary/10"
        >
          <Loader className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const renderDashboardHome = () => {
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto p-8 space-y-10 max-w-7xl"
      >
        <div className="flex flex-col lg:flex-row gap-10">
          <motion.div 
            variants={itemVariants}
            className="lg:w-2/3 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative p-8">
              <DashboardStats />
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="lg:w-1/3 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <DashboardChart />
            </div>
          </motion.div>
        </div>
        
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            variants={itemVariants}
            className="glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
              <QuickActions onRequestChat={onRequestChat} />
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
              <RecentActivity />
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-green-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
              <JobActions />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
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
        </AnimatePresence>

        {!isMobile && (
          <motion.div
            variants={itemVariants}
            className="fixed bottom-8 right-8 flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Radio className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Zap className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
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
      variants={containerVariants}
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
