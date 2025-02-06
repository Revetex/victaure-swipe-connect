
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyNotifications() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="visible"
      className="text-center text-muted-foreground py-8"
    >
      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>Aucune notification</p>
    </motion.div>
  );
}
