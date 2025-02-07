
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

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
  const { profile } = useProfile();
  const isOwnMessage = sender.id === profile?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={() => !read && onMarkAsRead(id)}
      className={cn(
        "flex w-full gap-3 p-4",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 ring-2 flex-shrink-0",
        isOwnMessage ? "ring-primary/20" : "ring-muted"
      )}>
        <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
        <AvatarFallback>
          {sender.full_name?.slice(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <span className="text-xs font-medium text-muted-foreground">
          {sender.full_name}
        </span>

        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted hover:bg-muted/80 transition-colors rounded-tl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { 
            addSuffix: true,
            locale: fr 
          })}
        </div>
      </div>
    </motion.div>
  );
}
