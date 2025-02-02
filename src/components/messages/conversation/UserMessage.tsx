import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface UserMessageProps {
  message: any;
  onClick: () => void;
}

export function UserMessage({ message, onClick }: UserMessageProps) {
  const sender = typeof message.sender === 'string' ? { full_name: message.sender } : message.sender;
  const formattedDate = message.timestamp ? format(new Date(message.timestamp), "d MMM", { locale: fr }) : "";
  const formattedTime = message.timestamp ? format(new Date(message.timestamp), "HH:mm", { locale: fr }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
        !message.read && "bg-muted/30"
      )}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{sender.full_name}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {message.content}
          </p>
          {!message.read && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
      </div>
    </motion.div>
  );
}