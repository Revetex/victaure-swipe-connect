
import { motion } from "framer-motion";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./NotificationItem";
import { groupNotifications } from "./utils/notificationGroups";

interface NotificationGroupsProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function NotificationGroups({ notifications, onDelete }: NotificationGroupsProps) {
  const groupedNotifications = groupNotifications(notifications);

  return (
    <motion.div className="space-y-6">
      {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
        <motion.div
          key={group}
          variants={itemVariants}
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
                variants={itemVariants}
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
  );
}
