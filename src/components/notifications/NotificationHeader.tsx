import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead?: () => void;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-primary">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      {unreadCount > 0 && onMarkAllAsRead && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1 hover:bg-primary/10"
        >
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Tout marquer comme lu</span>
        </Button>
      )}
    </div>
  );
}