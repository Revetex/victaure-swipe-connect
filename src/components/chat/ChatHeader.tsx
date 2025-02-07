
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  onBack: () => void;
  onDelete?: () => Promise<void>;
  isThinking?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

export function ChatHeader({
  title,
  subtitle,
  avatarUrl,
  onBack,
  onDelete,
  isThinking,
  isOnline,
  lastSeen
}: ChatHeaderProps) {
  return (
    <div className="h-16 flex items-center gap-4 p-4 border-b bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="relative">
        <Avatar className="h-10 w-10">
          <img
            src={avatarUrl || "/user-icon.svg"}
            alt={title}
            className="h-full w-full object-cover rounded-full"
          />
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="font-medium truncate">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
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

