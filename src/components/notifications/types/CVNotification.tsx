import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";

interface CVNotificationProps {
  id: string;
  message: string;
  onDelete: (id: string) => void;
}

export function CVNotification({ id, message, onDelete }: CVNotificationProps) {
  const handleAcceptCV = async () => {
    try {
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      // Notification pour l'accès au CV
      const { error: cvNotifError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'Accès au CV accordé',
          message: 'Votre demande d\'accès au CV a été acceptée. Vous pouvez maintenant voir le CV.',
        });

      if (cvNotifError) throw cvNotifError;

      // Notification pour l'accès au profil
      const { error: profileNotifError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'Accès au profil accordé',
          message: 'Votre demande d\'accès au profil a été acceptée. Vous pouvez maintenant voir le profil complet.',
        });

      if (profileNotifError) throw profileNotifError;

      onDelete(id);
      toast.success("Accès accordé avec succès");
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  const handleRejectCV = () => {
    try {
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      // Create rejection notification
      supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'Accès refusé',
          message: 'Votre demande d\'accès a été refusée.',
        });

      onDelete(id);
      toast.success("Demande refusée");
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Erreur lors du refus de la demande");
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        variant="default"
        className="flex items-center gap-1"
        onClick={handleAcceptCV}
      >
        <FileText className="h-4 w-4" />
        Accepter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={handleRejectCV}
      >
        <X className="h-4 w-4" />
        Refuser
      </Button>
    </div>
  );
}