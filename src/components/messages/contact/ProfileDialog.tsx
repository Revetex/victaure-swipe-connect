
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, VideoIcon, MessageSquare, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { convertOnlineStatusToBoolean } from "@/types/profile";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  profileId: string | null;
}

export function ProfileDialog({
  open,
  onOpenChange,
  name,
  avatar,
  isOnline,
  profileId
}: ProfileDialogProps) {
  // Ensure isOnline is a boolean
  const online = typeof isOnline === "boolean" ? isOnline : convertOnlineStatusToBoolean(isOnline);
  
  const handleCall = () => {
    toast.info("La fonctionnalité d'appel est en cours de développement");
  };
  
  const handleVideoCall = () => {
    toast.info("La fonctionnalité d'appel vidéo est en cours de développement");
  };
  
  const handleSendMessage = () => {
    onOpenChange(false);
    // Vous pourriez implémenter la navigation vers la messagerie ici
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* En-tête */}
        <div className="p-6 bg-gradient-to-b from-primary/20 to-primary/5 text-center relative">
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
              onClick={() => onOpenChange(false)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>
          
          <div className="mb-4 relative inline-block">
            <UserAvatar 
              user={{ 
                id: profileId || "user", 
                name: name, 
                image: avatar || undefined 
              }} 
              className="h-24 w-24 mx-auto" 
            />
            {online && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-1">{name}</h2>
          <Badge variant={online ? "default" : "secondary"} className="font-normal">
            {online ? "En ligne" : "Hors ligne"}
          </Badge>
        </div>
        
        {/* Actions */}
        <div className="p-4 flex justify-center gap-2 border-y">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={handleCall}
          >
            <Phone className="h-5 w-5" />
            <span className="sr-only">Appeler</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={handleVideoCall}
          >
            <VideoIcon className="h-5 w-5" />
            <span className="sr-only">Appel vidéo</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={handleSendMessage}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Envoyer un message</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Plus d'options</span>
          </Button>
        </div>
        
        {/* Contenu */}
        <div className="p-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>
              {profileId 
                ? "Consultez le profil complet pour voir plus d'informations" 
                : "Aucune information supplémentaire disponible pour ce contact"}
            </p>
            {profileId && (
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  onOpenChange(false);
                  // Navigation vers le profil
                }}
              >
                Voir le profil complet
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
