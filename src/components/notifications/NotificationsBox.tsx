
import { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationsList } from "./NotificationsList";
import { useNotificationsData } from "@/hooks/useNotificationsData";

export function NotificationsBox() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, deleteNotification, handleMarkAllAsRead } = useNotificationsData();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed right-4 top-16 w-[calc(100vw-2rem)] sm:w-96 rounded-lg border bg-card shadow-lg z-50",
                "sm:absolute sm:right-0 sm:top-full sm:mt-2",
                "max-h-[80vh] sm:max-h-[600px] flex flex-col"
              )}
            >
              <NotificationHeader 
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              
              <NotificationsList 
                notifications={notifications}
                onDelete={deleteNotification}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
