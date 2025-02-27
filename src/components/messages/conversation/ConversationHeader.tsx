
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Phone, 
  VideoIcon, 
  X, 
  CheckCircle2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { isToday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Receiver } from "@/hooks/useReceiver";

interface ConversationHeaderProps {
  partner: Receiver;
  onClose: () => void;
}

export function ConversationHeader({ partner, onClose }: ConversationHeaderProps) {
  const navigate = useNavigate();
  
  const getLastSeen = () => {
    if (partner.online_status === true) {
      return "En ligne";
    }
    
    if (!partner.last_seen) {
      return "Hors ligne";
    }
    
    try {
      const lastSeenDate = new Date(partner.last_seen);
      if (isToday(lastSeenDate)) {
        return `Vu ${formatDistanceToNow(lastSeenDate, {
          addSuffix: true,
          locale: fr
        })}`;
      } else {
        return `Vu le ${format(lastSeenDate, "dd MMM à HH:mm", {
          locale: fr
        })}`;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Hors ligne";
    }
  };

  return (
    <div className="border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-2" onClick={() => navigate(`/profile/${partner.id}`)}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={partner.avatar_url || undefined} alt={partner.full_name} />
          <AvatarFallback>
            {partner.full_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{partner.full_name}</div>
          <div className="text-xs text-muted-foreground flex items-center">
            {partner.online_status && (
              <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
            )}
            {getLastSeen()}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
        >
          <Phone className="h-4 w-4" />
          <span className="sr-only">Appel</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
        >
          <VideoIcon className="h-4 w-4" />
          <span className="sr-only">Vidéo</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Plus</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/profile/${partner.id}`)}>
              Voir le profil
            </DropdownMenuItem>
            <DropdownMenuItem>Bloquer</DropdownMenuItem>
            <DropdownMenuItem>Signaler</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground rounded-full h-8 w-8 md:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      </div>
    </div>
  );
}
