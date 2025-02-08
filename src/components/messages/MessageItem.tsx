
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface MessageItemProps {
  id: string;
  content: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
    online_status: boolean;
    last_seen: string;
  };
  created_at: string;
  read: boolean;
  status: string;
  onMarkAsRead?: () => void;
}

export function MessageItem({
  id,
  content,
  sender,
  created_at,
  read,
  status,
  onMarkAsRead
}: MessageItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
      onClick={onMarkAsRead}
    >
      <UserAvatar
        user={{
          name: sender.full_name,
          image: sender.avatar_url
        }}
        className="h-10 w-10"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium truncate">{sender.full_name}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(created_at), { locale: fr, addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{content}</p>
      </div>
    </motion.div>
  );
}
