import { Message } from "@/types/messages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
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

interface UserMessageProps {
  message: Message;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function UserMessage({ message, onSelect, onDelete }: UserMessageProps) {
  if (onSelect) {
    // Conversation list view
    return (
      <div 
        onClick={onSelect}
        className={cn(
          "p-4 rounded-lg cursor-pointer transition-all duration-200",
          "hover:scale-[1.02] hover:bg-muted/80",
          !message.read 
            ? "bg-primary/10 border-l-2 border-primary shadow-sm" 
            : "bg-muted"
        )}
      >
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={message.sender.avatar_url} alt={message.sender.full_name} />
            <AvatarFallback>
              {message.sender.full_name?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium truncate text-foreground">
                {message.sender.full_name}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(message.created_at), "HH:mm", { locale: fr })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chat message view
  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-start gap-2 max-w-[80%]">
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le message</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="bg-primary text-primary-foreground p-3 rounded-lg">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {format(new Date(message.created_at), "HH:mm", { locale: fr })}
      </span>
    </div>
  );
}