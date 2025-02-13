
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, ArrowLeft, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string | null;
  onBack?: () => void;
  onDelete?: () => void;
  isOnline?: boolean;
  lastSeen?: string;
}

export function ChatHeader({
  title,
  subtitle,
  avatarUrl,
  onBack,
  onDelete,
  isOnline,
  lastSeen
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {isOnline !== undefined && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div 
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`} 
              />
              {isOnline ? "En ligne" : lastSeen && `Vu ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: fr })}`}
            </div>
          )}
        </div>
      </div>
      {onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
