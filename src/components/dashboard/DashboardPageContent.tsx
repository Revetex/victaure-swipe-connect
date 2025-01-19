import { VCard } from "@/components/VCard";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { Settings } from "@/components/Settings";
import { CombinedTasksSection } from "@/components/todo/CombinedTasksSection";
import { memo } from "react";

interface DashboardPageContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
  todoProps: any;
  noteProps: any;
}

export const DashboardPageContent = memo(function DashboardPageContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
  todoProps,
  noteProps
}: DashboardPageContentProps) {
  switch (currentPage) {
    case 1:
      return (
        <div 
          key="vcard-container"
          className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pb-32' : 'relative min-h-[calc(100vh-4rem)]'}`}
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
    case 2:
      return (
        <div key="messages-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <Messages />
          </div>
        </div>
      );
    case 3:
      return (
        <div key="swipe-container" className="dashboard-card h-full">
          <SwipeJob />
        </div>
      );
    case 4:
      return (
        <div key="todo-notes-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <CombinedTasksSection 
              todoProps={todoProps}
              noteProps={noteProps}
            />
          </div>
        </div>
      );
    case 5:
      return (
        <div key="settings-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <Settings />
          </div>
        </div>
      );
    default:
      return null;
  }
});