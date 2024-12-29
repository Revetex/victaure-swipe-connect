import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";

interface NotificationsTabProps {
  notifications: {
    id: string;
    read: boolean;
  }[];
}

export function NotificationsTab({ notifications }: NotificationsTabProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <Bell className="h-8 w-8 mb-2" />
        <p>Aucune notification</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              !notification.read
                ? "bg-primary/10 border-l-2 border-primary"
                : "bg-muted"
            }`}
          >
            {/* Notification content will be implemented later */}
            <p>Notification {notification.id}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
