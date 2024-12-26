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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Agent Mr-Victaure */}
        <div className="lg:col-span-2 xl:col-span-1">
          <MrVictaure />
        </div>

        {/* Calendar */}
        <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
          <Calendar />
        </div>

        {/* Todo List */}
        <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
          <TodoList />
        </div>

        {/* Notifications */}
        <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
          <NotificationCenter />
        </div>

        {/* VCard */}
        <div className="lg:col-span-2">
          <VCard />
        </div>

        {/* SwipeJob */}
        <div className="lg:col-span-2">
          <SwipeJob />
        </div>

        {/* Messages */}
        <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
          <Messages />
        </div>

        {/* Settings */}
        <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
          <Settings />
        </div>

        {/* Marketplace */}
        <div className="lg:col-span-2">
          <Marketplace />
        </div>
      </div>
    </div>
  );
}