
import { Check, Trash2 } from "lucide-react";
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

interface NotificationActionsProps {
  hasUnread: boolean;
  hasNotifications: boolean;
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
}

export function NotificationActions({
  hasUnread,
  hasNotifications,
  onMarkAllRead,
  onDeleteAll
}: NotificationActionsProps) {
  return (
    <div className="flex gap-2">
      {hasUnread && (
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
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
  );
}
