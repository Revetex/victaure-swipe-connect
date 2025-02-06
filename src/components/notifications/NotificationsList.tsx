
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: any[];
  onDelete: (id: string) => void;
}

export function NotificationsList({ notifications, onDelete }: NotificationsListProps) {
  const groupNotificationsByDate = (notifications: any[]) => {
    return notifications.reduce((groups: any, notification) => {
      const date = format(new Date(notification.created_at), 'EEEE d MMMM', { locale: fr });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  };

  return (
    <ScrollArea className="h-[400px] mt-4">
      <AnimatePresence mode="popLayout">
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {notifications.length > 0 ? (
            Object.entries(groupNotificationsByDate(notifications)).map(([date, groupedNotifications]: [string, any[]]) => (
              <motion.div
                key={date}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium text-muted-foreground first-letter:uppercase">
                  {date}
                </h3>
                {groupedNotifications.map((notification: any) => (
                  <motion.div
                    key={notification.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                  >
                    <NotificationItem
                      {...notification}
                      onDelete={onDelete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center text-muted-foreground py-8"
            >
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
}
