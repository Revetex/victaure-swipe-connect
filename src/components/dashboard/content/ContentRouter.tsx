
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
  currentPage = 0, 
  onEditStateChange = () => {}, 
  onRequestChat = () => {},
  renderDashboardHome = () => null
}: ContentRouterProps) {
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const renderPage = () => {
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
        case 16:
          return <NotesSection />;
        case 17:
          return <JobsPage />;
        case 18:
          return <LotteryPage />;
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

  return renderPage();
}
