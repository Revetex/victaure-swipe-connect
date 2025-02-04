import { X, UserPlus, UserMinus, FileText, Upload, Eye } from "lucide-react";
import { formatTime } from "@/utils/dateUtils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VCard } from "@/components/VCard";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  id,
  title,
  message,
  created_at,
  read,
  onDelete,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const isFriendRequest = title.toLowerCase().includes("demande d'ami");
  const isCVRequest = title.toLowerCase().includes("demande de cv");
  const isAccessGranted = title.toLowerCase().includes("accès au cv accordé");

  const handleAcceptCV = async () => {
    try {
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      // Create notification for the requester
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'Accès au CV accordé',
          message: 'Votre demande d\'accès au CV a été acceptée. Vous pouvez maintenant voir le profil complet.',
        });

      if (notifError) throw notifError;

      onDelete(id);
      toast.success("Accès accordé avec succès");
    } catch (error) {
      console.error('Error accepting CV request:', error);
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
          title: 'Accès au CV refusé',
          message: 'Votre demande d\'accès au CV a été refusée.',
        });

      onDelete(id);
      toast.success("Demande refusée");
    } catch (error) {
      console.error('Error rejecting CV request:', error);
      toast.error("Erreur lors du refus de la demande");
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: senderId,
          title: 'Demande acceptée',
          message: 'Votre demande d\'ami a été acceptée',
        });

      if (notifError) {
        console.error('Error creating notification:', notifError);
      }

      onDelete(id);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriend = async () => {
    try {
      const senderId = message.match(/ID:(\S+)/)?.[1];
      if (!senderId) return;

      const { error: requestError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('sender_id', senderId);

      if (requestError) throw requestError;

      onDelete(id);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const requesterId = message.match(/ID:(\S+)/)?.[1];
      if (!requesterId) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: requesterId,
          title: 'CV reçu',
          message: `Un CV a été joint à votre demande. URL:${filePath}`,
        });

      if (notifError) throw notifError;

      toast.success("CV envoyé avec succès");
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error("Erreur lors de l'envoi du CV");
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "p-4 rounded-lg relative group transition-all duration-200",
          "hover:shadow-md dark:hover:shadow-none",
          read
            ? "bg-muted/50 dark:bg-muted/25"
            : "bg-primary/10 border-l-2 border-primary",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}
      >
        <button
          onClick={() => onDelete(id)}
          className={cn(
            "absolute right-2 top-2 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200",
            "hover:text-destructive focus:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring rounded-full p-1"
          )}
          aria-label="Supprimer la notification"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex justify-between items-start pr-6">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground">
            {formatTime(created_at)}
          </span>
        </div>

        <p className={cn(
          "text-sm text-muted-foreground mt-1",
          "line-clamp-2 group-hover:line-clamp-none transition-all duration-200"
        )}>
          {message}
        </p>

        {isFriendRequest && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
              onClick={handleAcceptFriend}
            >
              <UserPlus className="h-4 w-4" />
              Accepter
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleRejectFriend}
            >
              <UserMinus className="h-4 w-4" />
              Refuser
            </Button>
          </div>
        )}

        {isCVRequest && (
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
        )}

        {isAccessGranted && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
              onClick={() => setShowProfile(true)}
            >
              <Eye className="h-4 w-4" />
              Voir le profil
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              component="label"
            >
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Upload className="h-4 w-4" />
              Joindre CV
            </Button>
          </div>
        )}
      </motion.div>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <VCard />
        </DialogContent>
      </Dialog>
    </>
  );
}