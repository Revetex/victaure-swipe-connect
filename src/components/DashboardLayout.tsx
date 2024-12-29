import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 min-h-screen bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-1"}`}>
          <div className="glass-card rounded-lg p-3 sm:p-4">
            <Messages />
          </div>
        </div>

        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}>
          <SwipeJob />
        </div>

        <div className="glass-card rounded-lg p-3 sm:p-4">
          <TodoList />
        </div>

        <div className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}>
          <VCard />
        </div>
      </div>
    </div>
  );
}