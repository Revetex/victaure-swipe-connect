import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, CheckCheck, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Message } from "@/hooks/useMessages";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserMessageProps {
  message: Message;
  onMarkAsRead: (messageId: string) => void;
}

export function UserMessage({ message, onMarkAsRead }: UserMessageProps) {
  const navigate = useNavigate();
  
  const formatMessageDate = (date: string) => {
    return format(new Date(date), "d MMMM à HH:mm", { locale: fr });
  };

  const handleAcceptMessage = async () => {
    try {
      // Mark as read first
      await onMarkAsRead(message.id);
      
      // Then navigate to the conversation
      navigate(`/dashboard/messages/${message.sender_id}`);
      
      toast.success("Message accepté");
    } catch (error) {
      console.error("Erreur lors de l'acceptation du message:", error);
      toast.error("Erreur lors de l'acceptation du message");
    }
  };

  console.log("Message reçu:", message); // Pour le débogage

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative p-4 rounded-lg cursor-pointer bg-card hover:bg-card/80 border shadow-sm hover:shadow-md transition-all duration-200"
      onClick={handleAcceptMessage}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-base">{message.sender?.full_name || "Utilisateur"}</h3>
            {!message.read && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full animate-pulse">
                Nouveau
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatMessageDate(message.created_at)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(message.created_at), "HH:mm")}</span>
          </div>
          <div className="flex items-center gap-2">
            {message.read ? (
              <CheckCheck className="h-4 w-4 text-primary" />
            ) : (
              <Check className="h-4 w-4 text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}