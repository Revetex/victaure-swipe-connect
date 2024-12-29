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
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 min-h-screen bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {/* Agent Mr-Victaure - Toujours en haut sur mobile */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-1"}`}>
          <MrVictaure />
        </div>

        {/* SwipeJob - Pleine largeur sur mobile */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}>
          <SwipeJob />
        </div>

        {/* Composants secondaires - Empilés sur mobile */}
        <div className="glass-card rounded-lg p-3 sm:p-4">
          <TodoList />
        </div>

        <div className="glass-card rounded-lg p-3 sm:p-4">
          <Messages />
        </div>

        <div className="glass-card rounded-lg p-3 sm:p-4">
          <Settings />
        </div>

        {/* VCard - Pleine largeur en bas */}
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-3 2xl:col-span-4"}`}>
          <VCard />
        </div>
      </div>
    </div>
  );
}