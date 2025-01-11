import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, CheckCheck, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat/messageTypes";

interface UserMessageProps {
  message: Message;
  onMarkAsRead?: (messageId: string) => void;
}

export function UserMessage({ message, onMarkAsRead }: UserMessageProps) {
  const formatMessageDate = (date: string) => {
    return format(new Date(date), "d MMMM à HH:mm", { locale: fr });
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead && message.id) {
      onMarkAsRead(message.id);
    }
  };

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative p-4 rounded-lg cursor-pointer bg-card hover:bg-card/80 border shadow-sm hover:shadow-md transition-all duration-200"
      onClick={handleMarkAsRead}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{message.timestamp ? format(new Date(message.timestamp), "HH:mm") : ""}</span>
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