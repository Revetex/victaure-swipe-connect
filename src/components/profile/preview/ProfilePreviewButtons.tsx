
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfilePreviewButtonsProps {
  profileId: string;
  onMessage: () => void;
  showMessageButton?: boolean;
}

export function ProfilePreviewButtons({
  profileId,
  onMessage,
  showMessageButton = false
}: ProfilePreviewButtonsProps) {
  const [isPending, setIsPending] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsPending(true);
      // Simulation d'une requête d'ami
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Demande d'ami envoyée");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setIsPending(false);
    }
  };

  const handleReport = async () => {
    try {
      setIsReporting(true);
      // Simulation d'un signalement
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Profil signalé aux modérateurs");
    } catch (error) {
      toast.error("Erreur lors du signalement");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {showMessageButton && (
        <Button
          variant="default"
          size="sm"
          onClick={onMessage}
          className="flex-1"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnect}
        disabled={isPending}
        className="flex-1"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {isPending ? "Envoi..." : "Connecter"}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReport}
        disabled={isReporting}
        className="flex-none"
      >
        <AlertCircle className="h-4 w-4" />
        <span className="sr-only">Signaler</span>
      </Button>
    </div>
  );
}
