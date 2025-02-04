import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead?: () => void;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  const handleMarkAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      onMarkAllAsRead?.();
      toast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-primary">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          className="text-sm hover:bg-primary/10"
        >
          Tout marquer comme lu
        </Button>
      )}
    </div>
  );
}