import { Calendar } from "@/components/ui/calendar";
import { VCard } from "@/components/VCard";
import { TodoList } from "@/components/TodoList";
import { MrVictaure } from "@/components/MrVictaure";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { Settings } from "@/components/Settings";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {/* Agent Mr-Victaure - Always on top on mobile */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-1"}`}>
          <div className="glass-card p-4 h-full">
            <MrVictaure />
          </div>
        </div>

        {/* SwipeJob - Full width on mobile */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}>
          <div className="glass-card p-4 h-full">
            <SwipeJob />
          </div>
        </div>

        {/* Secondary components - Stacked on mobile */}
        <div className="glass-card p-4 h-full">
          <TodoList />
        </div>

        <div className="glass-card p-4 h-full">
          <Messages />
        </div>

        <div className="glass-card p-4 h-full">
          <Settings />
        </div>

        {/* VCard - Full width at bottom */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-3 2xl:col-span-4"}`}>
          <div className="glass-card p-4">
            <VCard />
          </div>
        </div>
      </div>
    </div>
  );
}