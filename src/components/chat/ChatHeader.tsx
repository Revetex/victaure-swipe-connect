
import { ArrowLeft, MoreVertical, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  isOnline,
  lastSeen
}: ChatHeaderProps) {
  const isAssistant = title === "M. Victaure";
  const formattedLastSeen = lastSeen ? format(new Date(lastSeen), 'PPP à HH:mm', { locale: fr }) : null;
  
  return (
    <div className="flex items-center gap-4 px-4 h-16 bg-background/95 backdrop-blur-sm border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="shrink-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10 border-2 border-background">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={title}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                <UserCircle className="h-5 w-5 text-primary" />
              </AvatarFallback>
            )}
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            {isAssistant ? (
              "Assistant virtuel"
            ) : isOnline ? (
              "En ligne"
            ) : formattedLastSeen ? (
              `Vu(e) le ${formattedLastSeen}`
            ) : (
              subtitle
            )}
          </p>
        </div>
      </div>

      {onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="shrink-0"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
