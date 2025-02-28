
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { ConversationHeaderProps } from "@/types/messages";
import { 
  ChevronLeft, 
  MoreVertical, 
  PhoneCall, 
  Search, 
  Video,
  Bell,
  BellOff,
  Archive,
  Trash2,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";

export function ConversationHeader({ 
  name, 
  avatar, 
  isOnline, 
  receiver,
  onBack 
}: ConversationHeaderProps) {
  const isMobile = useIsMobile();
  const [notificationsMuted, setNotificationsMuted] = useState(false);

  // Fonction pour déterminer le texte de statut
  const getStatusText = () => {
    if (isOnline) return "En ligne";
    if (receiver?.last_seen) {
      const lastSeen = new Date(receiver.last_seen);
      const now = new Date();
      const diffHours = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        return `Vu aujourd'hui à ${format(lastSeen, 'HH:mm', { locale: fr })}`;
      } else if (diffHours < 48) {
        return `Vu hier à ${format(lastSeen, 'HH:mm', { locale: fr })}`;
      } else {
        return `Vu le ${format(lastSeen, 'PP', { locale: fr })}`;
      }
    }
    return "Hors ligne";
  };

  return (
    <div className="flex items-center p-4 border-b border-[#64B5D9]/10 bg-background/80 backdrop-blur-sm">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={onBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <UserAvatar 
        user={{ id: receiver?.id || "", name, image: avatar || "" }}
        className="h-10 w-10"
      />
      
      <div className="ml-3 flex-1">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className={cn(
          "text-xs",
          isOnline ? "text-green-500" : "text-muted-foreground"
        )}>
          {getStatusText()}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => toast.info("Appel audio à venir")}
        >
          <PhoneCall className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => toast.info("Appel vidéo à venir")}
        >
          <Video className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => toast.info("Recherche dans la conversation à venir")}
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                setNotificationsMuted(!notificationsMuted);
                toast.success(notificationsMuted 
                  ? "Notifications activées" 
                  : "Notifications désactivées"
                );
              }}
              className="cursor-pointer"
            >
              {notificationsMuted ? (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Activer les notifications</span>
                </>
              ) : (
                <>
                  <BellOff className="mr-2 h-4 w-4" />
                  <span>Désactiver les notifications</span>
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => toast.info("Archivage de conversation à venir")}
              className="cursor-pointer"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>Archiver la conversation</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => toast.info("Blocage d'utilisateur à venir")}
              className="cursor-pointer text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            >
              <UserX className="mr-2 h-4 w-4" />
              <span>Bloquer l'utilisateur</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => toast.info("Suppression de conversation à venir")}
              className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Supprimer la conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
