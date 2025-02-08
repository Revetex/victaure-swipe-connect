
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
  className?: string;
}

export function ChatHeader({
  title,
  subtitle,
  avatarUrl,
  onBack,
  onDelete,
  isOnline,
  lastSeen,
  className
}: ChatHeaderProps) {
  return (
    <div className={`flex-shrink-0 bg-background/95 backdrop-blur z-[999] border-b ${className || ''}`}>
      <div className="flex items-center gap-4 px-4 h-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
          title="Retour"
          aria-label="Retour à la liste des conversations"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10">
            <img
              src={avatarUrl || "/user-icon.svg"}
              alt={title}
              className="h-full w-full object-cover"
            />
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
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
              <Button 
                variant="ghost" 
                size="icon"
                title="Options de conversation"
                aria-label="Ouvrir les options de conversation"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[999]">
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
