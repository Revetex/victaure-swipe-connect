
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Charger les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.read).length || 0);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Écouter les nouvelles notifications
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("Changement de notification:", payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (!user?.id || notifications.length === 0) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error);
    }
  };

  // Formater la date relative
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: fr,
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative mr-1"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-300" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-[10px]"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-zinc-900 border-zinc-800"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-blue-400"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {isLoading ? (
              <div className="py-8 text-center text-zinc-500">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id}>
                  <DropdownMenuItem
                    className={`px-4 py-3 cursor-pointer ${
                      !notification.read
                        ? "bg-blue-500/10 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-sm">
                          {notification.title}
                        </span>
                        <span className="text-xs text-zinc-500 ml-2 whitespace-nowrap">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 break-words line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="flex justify-end mt-1">
                          <Badge
                            className="px-2 py-0 h-5 text-[10px] bg-blue-500"
                            variant="default"
                          >
                            Nouveau
                          </Badge>
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800 my-0" />
                </div>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
