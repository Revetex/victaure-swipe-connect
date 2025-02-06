
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/components/notifications/hooks/useNotifications";
import { NotificationGroups } from "@/components/notifications/NotificationGroups";
import { NotificationActions } from "@/components/notifications/NotificationActions";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function NotificationsTab() {
  const { notifications, isLoading, deleteNotification, markAllAsRead, deleteAllNotifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          className="flex items-center gap-2 text-primary"
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold">Notifications</h2>
        </motion.div>

        <NotificationActions
          hasUnread={notifications.some(n => !n.read)}
          hasNotifications={notifications.length > 0}
          onMarkAllRead={markAllAsRead}
          onDeleteAll={deleteAllNotifications}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            <NotificationGroups
              notifications={notifications}
              onDelete={deleteNotification}
            />
          ) : (
            <EmptyNotifications />
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}
