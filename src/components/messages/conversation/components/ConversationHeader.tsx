
import { ArrowLeft, MoreVertical, Phone, PhoneCall, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { Receiver } from "@/types/messages";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ConversationHeaderProps {
  receiver: Receiver;
  onBack: () => void;
  onDelete: () => Promise<void>;
}

export function ConversationHeader({ receiver, onBack, onDelete }: ConversationHeaderProps) {
  const [isInCall, setIsInCall] = useState(false);

  const handleCallClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      // Pour l'instant, nous simulons juste un appel
      setIsInCall(true);
      toast.success("Appel en cours avec " + receiver.full_name);
      
      // Dans un cas réel, nous établirions ici une connexion WebRTC
      
      // Nettoyage après "l'appel"
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsInCall(false);
        toast.info("Appel terminé");
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    toast.info("Appel terminé");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <UserAvatar 
          user={receiver}
          className="h-8 w-8"
        />
        
        <div className="flex flex-col">
          <span className="font-semibold">
            {receiver.full_name || "Utilisateur"}
          </span>
          {receiver.online_status && (
            <span className="text-xs text-muted-foreground">
              En ligne
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {receiver.id !== 'assistant' && (
          <Button
            variant={isInCall ? "destructive" : "ghost"}
            size="icon"
            onClick={isInCall ? handleEndCall : handleCallClick}
            className="rounded-full"
          >
            {isInCall ? (
              <PhoneOff className="h-4 w-4" />
            ) : (
              <PhoneCall className="h-4 w-4" />
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Supprimer la conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
