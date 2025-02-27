
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, Info } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfileDialog } from "@/components/messages/contact/ProfileDialog";
import { toast } from "sonner";
import { convertOnlineStatusToBoolean } from "@/types/profile";

interface ConversationHeaderProps {
  name: string | null;
  avatar: string | null;
  isOnline: boolean;
  lastSeen?: string | null;
}

export function ConversationHeader({ name, avatar, isOnline, lastSeen }: ConversationHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  
  // Assurons-nous que isOnline est un booléen
  const online = typeof isOnline === 'boolean' ? isOnline : convertOnlineStatusToBoolean(isOnline);

  const handleCall = () => {
    toast.info("Fonctionnalité d'appel en développement");
  };
  
  const handleVideoCall = () => {
    toast.info("Fonctionnalité d'appel vidéo en développement");
  };
  
  const getLastSeenText = () => {
    if (online) return "En ligne";
    if (!lastSeen) return "Hors ligne";
    
    try {
      const lastSeenDate = new Date(lastSeen);
      if (isToday(lastSeenDate)) {
        return "Vu " + formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: fr });
      }
      return "Vu " + format(lastSeenDate, 'dd MMM à HH:mm', { locale: fr });
    } catch {
      return "Hors ligne";
    }
  };

  return (
    <>
      <div className="border-b px-4 py-3 bg-card flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar || undefined} alt={name || "Contact"} />
            <AvatarFallback>{name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name || "Contact"}</div>
            <div className="text-xs text-muted-foreground">
              {getLastSeenText()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={handleCall}
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Appeler</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={handleVideoCall}
          >
            <Video className="h-5 w-5" />
            <span className="sr-only">Appel vidéo</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Plus d'options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                <Info className="h-4 w-4 mr-2" />
                <span>Voir le profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Bloquer</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                Signaler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ProfileDialog 
        open={showProfile} 
        onOpenChange={setShowProfile} 
        name={name || "Contact"} 
        avatar={avatar} 
        isOnline={online}
        profileId={null}
      />
    </>
  );
}
