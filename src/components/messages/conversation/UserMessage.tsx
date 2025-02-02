import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UserMessageProps {
  message: any;
}

export function UserMessage({ message }: UserMessageProps) {
  const formattedDate = message.created_at ? format(new Date(message.created_at), "d MMMM", { locale: fr }) : "";
  const formattedTime = message.created_at ? format(new Date(message.created_at), "HH:mm", { locale: fr }) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] bg-card hover:bg-card/80 border shadow-sm hover:shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative flex gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary/20">
          <AvatarImage src={message.sender?.avatar_url} alt={message.sender?.full_name} />
          <AvatarFallback className="bg-primary/5">
            <User className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-semibold text-lg">{message.sender?.full_name}</h3>
            {!message.read && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                Nouveau
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 text-left">
            {message.content}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
            <span className="mx-1">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}