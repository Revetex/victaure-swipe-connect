import { useState } from "react";
import { AIAssistant } from "./AIAssistant";
import { DashboardStats } from "./DashboardStats";
import { ScrapedJobs } from "./ScrapedJobs";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (value: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleCloseAIAssistant = () => {
    setIsAIAssistantOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {currentPage === 3 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardStats />
            <div className="lg:col-span-2">
              <ScrapedJobs />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QuickActions onAIAssistantOpen={() => setIsAIAssistantOpen(true)} />
            </div>
            <RecentActivity />
          </div>
          <AIAssistant 
            isOpen={isAIAssistantOpen} 
            onClose={handleCloseAIAssistant}
          />
        </>
      )}
    </div>
  );
}