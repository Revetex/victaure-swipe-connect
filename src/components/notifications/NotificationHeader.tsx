import { Bell } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
}

export function NotificationHeader({ unreadCount }: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-primary">
        <Bell className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
        {unreadCount} nouvelles
      </span>
    </div>
  );
}