
import { Message } from "@/types/messages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

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
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
      onClick={onMarkAsRead}
    >
      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
        <AvatarImage 
          src={sender.avatar_url}
          alt={sender.full_name}
        />
        <AvatarFallback>
          {sender.full_name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <section className="flex-1 min-w-0">
        <header className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate">{sender.full_name}</h3>
          <div className="flex items-center gap-2">
            {status === 'sent' && (
              <Check className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            {status === 'delivered' && (
              <Check className="h-4 w-4 text-muted-foreground" />
            )}
            {status === 'read' && (
              <CheckCheck className="h-4 w-4 text-primary" />
            )}
            <time className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(created_at), { locale: fr, addSuffix: true })}
            </time>
          </div>
        </header>
        <p className="text-sm text-muted-foreground truncate">{content}</p>
      </section>
    </motion.article>
  );
}
