import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { Settings } from "@/components/Settings";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";

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

  if (currentPage === 2) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <Messages />
        </div>
      </div>
    );
  }

  if (currentPage === 3) {
    return (
      <div className="dashboard-card h-full">
        <SwipeJob />
      </div>
    );
  }

  if (currentPage === 4) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <div className="space-y-6">
            <TodoSection />
            <NotesSection />
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 5) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <Settings />
        </div>
      </div>
    );
  }

  return null;
}