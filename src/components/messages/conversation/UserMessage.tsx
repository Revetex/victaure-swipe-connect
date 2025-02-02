import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Message } from "@/hooks/useMessages";

interface UserMessageProps {
  message: Message;
  onMarkAsRead: (messageId: string) => void;
}

export function UserMessage({ message, onMarkAsRead }: UserMessageProps) {
  const formatMessageDate = (date: string) => {
    return format(new Date(date), "d MMMM à HH:mm", { locale: fr });
  };

  console.log("Message reçu:", message); // Pour le débogage

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative p-4 rounded-lg cursor-pointer bg-card hover:bg-card/80 border shadow-sm hover:shadow-md transition-all duration-200"
      onClick={() => onMarkAsRead(message.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-medium">
              {message.sender?.full_name || "Utilisateur"}
            </div>
            {!message.read && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatMessageDate(message.created_at)}
          </div>
        </div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {message.content}
        </div>
        {!message.read && (
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(message.id);
              }}
            >
              Accepter
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}