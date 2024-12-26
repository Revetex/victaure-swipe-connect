import { Calendar } from "@/components/ui/calendar";
import { VCard } from "@/components/VCard";
import { TodoList } from "@/components/TodoList";
import { MrVictaure } from "@/components/MrVictaure";
import { NotificationCenter } from "@/components/NotificationCenter";
import { SwipeJob } from "@/components/SwipeJob";
import { Messages } from "@/components/Messages";
import { Settings } from "@/components/Settings";
import { Marketplace } from "@/components/Marketplace";

export function DashboardLayout() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 min-h-screen bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {/* Agent Mr-Victaure */}
        <div className="sm:col-span-2 lg:col-span-1">
          <MrVictaure />
        </div>

        {/* Todo List */}
        <div className="glass-card rounded-lg p-3 sm:p-4">
          <TodoList />
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-lg p-3 sm:p-4">
          <NotificationCenter />
        </div>

        {/* VCard */}
        <div className="sm:col-span-2">
          <VCard />
        </div>

        {/* SwipeJob */}
        <div className="sm:col-span-2">
          <SwipeJob />
        </div>

        {/* Messages */}
        <div className="glass-card rounded-lg p-3 sm:p-4">
          <Messages />
        </div>

        {/* Settings */}
        <div className="glass-card rounded-lg p-3 sm:p-4">
          <Settings />
        </div>

        {/* Marketplace */}
        <div className="sm:col-span-2">
          <Marketplace />
        </div>
      </div>
    </div>
  );
}