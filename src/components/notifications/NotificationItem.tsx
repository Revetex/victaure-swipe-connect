import { X, Bell, MessageSquare, Briefcase, Check } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FriendRequestNotification } from "./types/FriendRequestNotification";
import { CVNotification } from "./types/CVNotification";
import { CVUploadNotification } from "./types/CVUploadNotification";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const isCVRequest = title.toLowerCase().includes("demande de cv");
  const isCVAccepted = title.toLowerCase().includes("accès au cv accordé");

  const markAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Erreur lors du marquage de la notification");
    }
  };

  const getIcon = () => {
    if (isFriendRequest) return <MessageSquare className="h-5 w-5 text-blue-500" />;
    if (isCVRequest || isCVAccepted) return <Briefcase className="h-5 w-5 text-green-500" />;
    return <Bell className="h-5 w-5 text-yellow-500" />;
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
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={markAsRead}
            className="h-8 w-8 hover:text-primary focus:opacity-100"
          >
            <span className="sr-only">Marquer comme lu</span>
            <Check className="h-4 w-4" />
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive focus:opacity-100"
            >
              <span className="sr-only">Supprimer la notification</span>
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la notification</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-start gap-4 pr-16">
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm text-foreground">
              {title}
            </h3>
            <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {formatTime(created_at)}
            </span>
          </div>
          <p className={cn(
            "text-sm text-muted-foreground mt-1",
            "line-clamp-2 group-hover:line-clamp-none transition-all duration-200"
          )}>
            {message}
          </p>
        </div>
      </div>

      {isFriendRequest && (
        <FriendRequestNotification
          id={id}
          message={message}
          onDelete={onDelete}
        />
      )}

      {isCVRequest && (
        <CVNotification
          id={id}
          message={message}
          onDelete={onDelete}
        />
      )}

      {isCVAccepted && (
        <CVUploadNotification
          id={id}
          message={message}
          onDelete={onDelete}
        />
      )}
    </motion.div>
  );
}