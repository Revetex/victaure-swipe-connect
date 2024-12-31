import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

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
        "p-4 rounded-lg cursor-pointer transition-all duration-200",
        "hover:scale-[1.02] hover:bg-muted/80",
        !read 
          ? "bg-primary/10 border-l-2 border-primary shadow-sm" 
          : "bg-muted"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
          <AvatarFallback>
            {sender.full_name?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium truncate text-foreground">
              {sender.full_name}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(created_at), { 
                addSuffix: true,
                locale: fr 
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}