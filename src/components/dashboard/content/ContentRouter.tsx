
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
  const commonClassName = "min-h-screen pt-14 lg:pt-0";

  return (
    <div className="h-full">
      {(() => {
        switch (currentPage) {
          case 1:
            return (
              <div className={commonClassName}>
                <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
              </div>
            );
          case 2:
            return <Messages />;
          case 3:
            return (
              <div className={commonClassName}>
                <Marketplace />
              </div>
            );
          case 4:
            return (
              <div className="min-h-screen pt-16">
                <Feed />
              </div>
            );
          case 7:
            return (
              <div className={commonClassName}>
                <TasksPage />
              </div>
            );
          case 8:
            return (
              <div className={`${commonClassName} bg-card/5`}>
                <CalculatorPage />
              </div>
            );
          case 9:
            return (
              <div className={commonClassName}>
                <NotificationsTab />
              </div>
            );
          case 10:
            return (
              <div className={`${commonClassName} bg-background`}>
                <Settings />
              </div>
            );
          case 12:
            return (
              <div className={commonClassName}>
                <FriendsList />
              </div>
            );
          case 14:
            return (
              <div className={`${commonClassName} bg-card/5`}>
                <TranslatorPage />
              </div>
            );
          case 16:
            return (
              <div className={`${commonClassName} bg-card/5`}>
                <NotesSection />
              </div>
            );
          case 17:
            return (
              <div className={commonClassName}>
                <JobsPage />
              </div>
            );
          case 18:
            return (
              <div className={`${commonClassName} bg-card/5`}>
                <LotteryPage />
              </div>
            );
          default:
            return renderDashboardHome();
        }
      })()}
    </div>
  );
}
