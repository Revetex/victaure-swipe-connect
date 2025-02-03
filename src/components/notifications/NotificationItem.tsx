import { X, UserPlus, UserMinus } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  id,
  title,
  message,
  created_at,
  read,
  onDelete,
}: NotificationItemProps) {
  const isFriendRequest = title.toLowerCase().includes("demande d'ami");

  const handleAcceptFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: senderId,
          title: 'Demande acceptée',
          message: 'Votre demande d\'ami a été acceptée',
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
      }

      onDelete(id);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      onDelete(id);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "p-4 rounded-lg relative group transition-all duration-200",
        "hover:shadow-md dark:hover:shadow-none",
        read
          ? "bg-muted/50 dark:bg-muted/25"
          : "bg-primary/10 border-l-2 border-primary",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}
    >
      <button
        onClick={() => onDelete(id)}
        className={cn(
          "absolute right-2 top-2 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
          "hover:text-destructive focus:opacity-100",
          "focus:outline-none focus:ring-2 focus:ring-ring rounded-full p-1"
        )}
        aria-label="Supprimer la notification"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex justify-between items-start pr-6">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {formatTime(created_at)}
        </span>
      </div>

      <p className={cn(
        "text-sm text-muted-foreground mt-1",
        "line-clamp-2 group-hover:line-clamp-none transition-all duration-200"
      )}>
        {message}
      </p>

      {isFriendRequest && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-1"
            onClick={handleAcceptFriend}
          >
            <UserPlus className="h-4 w-4" />
            Accepter
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={handleRejectFriend}
          >
            <UserMinus className="h-4 w-4" />
            Refuser
          </Button>
        </div>
      )}
    </motion.div>
  );
}