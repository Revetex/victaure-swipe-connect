
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/types/notification";
import { isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

interface NotificationsContentProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
}

const groupNotifications = (notifications: Notification[]) => {
  return notifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at);
    let groupKey = "";

    if (isToday(date)) {
      groupKey = "Aujourd'hui";
    } else if (isYesterday(date)) {
      groupKey = "Hier";
    } else if (isThisWeek(date)) {
      groupKey = "Cette semaine";
    } else if (isThisMonth(date)) {
      groupKey = "Ce mois";
    } else {
      groupKey = "Plus ancien";
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);
};

export function NotificationsContent({ notifications, onDelete }: NotificationsContentProps) {
  const groupedNotifications = groupNotifications(notifications);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <AnimatePresence mode="popLayout">
        {notifications.length > 0 ? (
          <motion.div className="space-y-6">
            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
              <motion.div
                key={group}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{group}</h3>
                <div className="space-y-2">
                  {groupNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      layout
                    >
                      <NotificationItem
                        {...notification}
                        onDelete={onDelete}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
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
      </AnimatePresence>
    </ScrollArea>
  );
}
