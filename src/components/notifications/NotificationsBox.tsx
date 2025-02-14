
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsContent } from "./NotificationsContent";
import { useNotificationsData } from "@/hooks/useNotificationsData";
import { NotificationsLoader } from "./NotificationsLoader";

export function NotificationsBox() {
  const { notifications, isLoading, deleteNotification, markAllAsRead, deleteAllNotifications } = useNotificationsData();

  if (isLoading) {
    return <NotificationsLoader />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-md mx-auto">
      <NotificationsHeader 
        unreadCount={unreadCount}
        hasNotifications={notifications.length > 0}
        onMarkAllAsRead={markAllAsRead}
        onDeleteAll={deleteAllNotifications}
      />
      <NotificationsContent 
        notifications={notifications}
        onDelete={deleteNotification}
      />
    </div>
  );
}
