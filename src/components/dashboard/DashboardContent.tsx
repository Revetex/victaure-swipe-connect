import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { Tabs } from "@/components/ui/tabs";
import { DashboardTabs } from "./DashboardTabs";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  if (currentPage === 1) {
    return (
      <div 
        className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm' : 'relative'}`}
        style={{ 
          height: isEditing ? viewportHeight : 'auto',
          overflowY: isEditing ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 2 && !isEditing) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <Tabs defaultValue="messages" className="h-full flex flex-col">
            <DashboardTabs />
            <Messages />
          </Tabs>
        </div>
      </div>
    );
  }

  if (currentPage === 3 && !isEditing) {
    return (
      <div className="dashboard-card h-full">
        <SwipeJob />
      </div>
    );
  }

  return null;
}