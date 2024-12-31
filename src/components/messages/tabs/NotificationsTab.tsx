import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "../../notifications/NotificationItem";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Vous devez être connecté pour voir vos notifications");
          return;
        }

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error("Impossible de charger les notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      toast.error("Impossible de supprimer la notification");
    }
  };

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
      className="p-4"
    >
      <motion.div 
        variants={itemVariants}
        className={cn(
          "flex items-center gap-2 text-primary mb-4",
          "border-b pb-2"
        )}
      >
        <Bell className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </motion.div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            <motion.div className="space-y-2">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <NotificationItem
                    {...notification}
                    onDelete={deleteNotification}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center text-muted-foreground py-8"
            >
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}