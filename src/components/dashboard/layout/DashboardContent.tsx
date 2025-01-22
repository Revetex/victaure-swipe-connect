import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHeader } from "../DashboardHeader";
import { DashboardStats } from "../DashboardStats";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { ScrapedJobs } from "../ScrapedJobs";
import { Messages } from "@/components/Messages";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
}

export const DashboardContent = memo(function DashboardContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6 p-4">
            <DashboardHeader 
              title="Tableau de bord" 
              description="Bienvenue sur votre espace personnel"
            />
            <DashboardStats />
            <QuickActions stats={{
              activeJobs: 0,
              unreadMessages: 0,
              pendingPayments: "CAD 0",
              nextJob: "Aucune"
            }} />
            <RecentActivity />
          </div>
        );
      case 2:
        return <ScrapedJobs />;
      case 3:
        return <Messages />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-auto pb-20"
    >
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </motion.div>
  );
});