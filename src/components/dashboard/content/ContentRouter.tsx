
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import Settings from "@/components/Settings";
import { NotesSection } from "@/components/notes/NotesSection";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendsList } from "@/components/feed/FriendsList";
import { LotteryPage } from "@/components/lottery/LotteryPage";
import { JobsPage } from "@/components/jobs/JobsPage";
import { motion } from "framer-motion";

interface ContentRouterProps {
  currentPage: number;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
  renderDashboardHome: () => JSX.Element;
}

export function ContentRouter({ 
  currentPage, 
  onEditStateChange, 
  onRequestChat,
  renderDashboardHome 
}: ContentRouterProps) {

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderPage = () => {
    const content = (() => {
      switch (currentPage) {
        case 1:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-sm">
              <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
            </div>
          );
        case 2:
          return <Messages />;
        case 3:
          return <Marketplace />;
        case 4:
          return (
            <div className="min-h-screen pt-16 lg:pt-16 bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-sm">
              <Feed />
            </div>
          );
        case 7:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-sm">
              <TasksPage />
            </div>
          );
        case 8:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-card/5 backdrop-blur-sm">
              <CalculatorPage />
            </div>
          );
        case 9:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 backdrop-blur-sm">
              <NotificationsTab />
            </div>
          );
        case 10:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-background/80 backdrop-blur-sm">
              <Settings />
            </div>
          );
        case 12:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-sm">
              <FriendsList />
            </div>
          );
        case 14:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-card/5 backdrop-blur-sm">
              <TranslatorPage />
            </div>
          );
        case 16:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-card/5 backdrop-blur-sm">
              <NotesSection />
            </div>
          );
        case 17:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-sm">
              <JobsPage />
            </div>
          );
        case 18:
          return (
            <div className="min-h-screen pt-16 lg:pt-0 bg-card/5 backdrop-blur-sm">
              <LotteryPage />
            </div>
          );
        default:
          return renderDashboardHome();
      }
    })();

    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="h-full relative overflow-hidden">
      {renderPage()}
    </div>
  );
}
