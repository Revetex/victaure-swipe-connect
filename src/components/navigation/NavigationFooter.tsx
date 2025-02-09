
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { ThemeToggle } from "@/components/ThemeToggle";

export function NavigationFooter() {
  return (
    <div className="h-12 border-t bg-background/50 backdrop-blur flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <NotificationsBox />
        <ThemeToggle />
      </div>
    </div>
  );
}
