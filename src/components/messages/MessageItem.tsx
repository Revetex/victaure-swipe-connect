import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface MessageSender {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface MessageItemProps {
  id: string;
  content: string;
  sender: MessageSender;
  created_at: string;
  read: boolean;
  onMarkAsRead: (messageId: string) => void;
}

export function MessageItem({
  id,
  content,
  sender,
  created_at,
  read,
  onMarkAsRead,
}: MessageItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onClick={() => !read && onMarkAsRead(id)}
      className={cn(
        "group relative p-4 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-muted/80 hover:scale-[1.02]",
        !read 
          ? "bg-primary/5 border-l-2 border-primary shadow-sm" 
          : "bg-background hover:shadow-sm"
      )}
    >
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 shrink-0 shadow-sm">
          <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
          <AvatarFallback className="bg-primary/10">
            {sender.full_name?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <h3 className={cn(
                "font-medium leading-none",
                !read && "text-primary"
              )}>
                {sender.full_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(created_at), { 
                  addSuffix: true,
                  locale: fr 
                })}
              </p>
            </div>
            {!read && (
              <span className="shrink-0 h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content}
          </p>
        </div>
      </div>
      <div className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200",
        "group-hover:opacity-100"
      )}>
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
      </div>
    </motion.div>
  );
}