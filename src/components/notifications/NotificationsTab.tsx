
import { motion } from "framer-motion";
import { useNotificationsData } from "./hooks/useNotificationsData";
import { NotificationsLoader } from "./NotificationsLoader";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsContent } from "./NotificationsContent";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect } from "react";

export function NotificationsTab() {
  const {
    notifications,
    isLoading,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications
  } = useNotificationsData();

  const { markAllAsRead: markAllNotificationsAsRead } = useNotifications();

  useEffect(() => {
    // Marquer toutes les notifications comme lues à l'ouverture
    markAllNotificationsAsRead();
  }, []);

  if (isLoading) {
    return <NotificationsLoader />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-20"
    >
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
    </motion.div>
  );
}
