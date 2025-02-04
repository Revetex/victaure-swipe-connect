import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./NotificationItem";
import { NotificationHeader } from "./NotificationHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NotificationsBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
      toast.success("Notification supprimée");
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute right-0 top-full mt-2 w-80 rounded-lg border bg-card p-4 shadow-lg z-50",
                "before:absolute before:-top-2 before:right-4 before:h-4 before:w-4 before:rotate-45 before:border-l before:border-t before:bg-card"
              )}
            >
              <NotificationHeader 
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
              
              <ScrollArea className="h-[400px] mt-4">
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    className="space-y-2"
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
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <NotificationItem
                            {...notification}
                            onDelete={deleteNotification}
                          />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}