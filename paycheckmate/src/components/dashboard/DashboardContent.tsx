import { AnimatePresence, motion } from "framer-motion";
import { Messages } from "@/components/Messages";
import { Tools } from "@/components/Tools";
import { Settings } from "@/components/Settings";
import { UnifiedBoard } from "@/components/board/UnifiedBoard";
import { AIAssistant } from "./AIAssistant";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { ScrapedJobs } from "./ScrapedJobs";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  onEditStateChange: (editing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {currentPage === 1 && (
          <div className="space-y-8 pb-20">
            <DashboardStats />
            <QuickActions />
            <RecentActivity />
          </div>
        )}

        {currentPage === 2 && (
          <div className="pb-20">
            <Messages />
          </div>
        )}

        {currentPage === 3 && (
          <div className="pb-20">
            <UnifiedBoard />
            <ScrapedJobs />
          </div>
        )}

        {currentPage === 4 && (
          <div className="pb-20">
            <AIAssistant onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
          </div>
        )}

        {currentPage === 5 && (
          <div className="pb-20">
            <Tools />
          </div>
        )}

        {currentPage === 6 && (
          <div className="pb-20">
            <Settings />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}