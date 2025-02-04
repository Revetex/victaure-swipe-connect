import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Send } from "lucide-react";
import { sendPushNotification } from "@/utils/pushNotifications";

interface CVRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export function CVRequestDialog({ isOpen, onClose, recipientId, recipientName }: CVRequestDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleRequestCV = async () => {
    if (!user) return;
    
    setIsSending(true);
    try {
      // Create notification for CV request
      await supabase.from("notifications").insert({
        user_id: recipientId,
        title: "Demande de CV",
        message: `${user.email} aimerait consulter votre CV. ID:${user.id}`,
      });

      // Send push notification
      await sendPushNotification(
        recipientId,
        "Nouvelle demande de CV",
        `${user.email} aimerait consulter votre CV`
      );

      toast.success("Demande de CV envoyée avec succès");
      onClose();
    } catch (error) {
      console.error("Error requesting CV:", error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Demander le CV</DialogTitle>
          <DialogDescription>
            Envoyez une demande pour consulter le CV de {recipientName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>
              {recipientName} sera notifié(e) de votre demande et pourra accepter ou refuser
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleRequestCV} 
              disabled={isSending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}