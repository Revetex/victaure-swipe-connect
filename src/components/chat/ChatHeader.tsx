
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface ChatHeaderProps {
  title: string;
  subtitle: string;
  avatarUrl: string;
  onBack: () => void;
  onDelete: () => Promise<void>;
  isOnline?: boolean;
  lastSeen?: string;
  actions?: React.ReactNode;
}

export function ChatHeader({ 
  title, 
  subtitle, 
  avatarUrl, 
  onBack, 
  onDelete,
  isOnline,
  lastSeen,
  actions
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} alt={title} />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            {subtitle}
            {lastSeen && !isOnline && (
              <span className="ml-1">
                (Vu {formatDistanceToNow(new Date(lastSeen), { locale: fr, addSuffix: true })})
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
