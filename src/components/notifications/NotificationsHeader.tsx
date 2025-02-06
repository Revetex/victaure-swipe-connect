
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface NotificationsHeaderProps {
  unreadCount: number;
  hasNotifications: boolean;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

export function NotificationsHeader({
  unreadCount,
  hasNotifications,
  onMarkAllAsRead,
  onDeleteAll
}: NotificationsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.div 
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 }
        }}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 text-primary"
      >
        <div className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </motion.div>

      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 hover:bg-primary/10"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Tout marquer comme lu</span>
          </Button>
        )}

        {hasNotifications && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Tout supprimer</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera toutes vos notifications. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAll}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
